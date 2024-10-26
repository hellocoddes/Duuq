// main.go
package main

import (
    "bytes"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "hash/fnv"
    "io/ioutil"
    "log"
    "net/http"
    "strings"

    "github.com/gorilla/mux"
    "github.com/patrickmn/go-cache"
)

// Define the API constants
const (
    API_KEY    = "nvapi"
    invokeURL  = "https://ai.api.nvidia.com/v1/gr/meta/llama-3.2-90b-vision-instruct/chat/completions"
)

// Initialize a cache with a default expiration time and cleanup interval
var c = cache.New(cache.DefaultExpiration, cache.DefaultExpiration)

type RequestPayload struct {
    Model      string   `json:"model"`
    Messages   []Message `json:"messages"`
    MaxTokens  int      `json:"max_tokens"`
    Temperature float64  `json:"temperature"`
    TopP       float64  `json:"top_p"`
}

type Message struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

type ResponsePayload struct {
    Choices []Choice `json:"choices"`
}

type Choice struct {
    Message Message `json:"message"`
}

func generateCacheKey(imageB64 string) string {
    h := fnv.New64a()
    h.Write([]byte(imageB64))
    return fmt.Sprintf("%x", h.Sum(nil))
}

func getThreatAnalysis(imageB64 string) (string, error) {
    // Check if the response is cached
    if cachedResult, found := c.Get(generateCacheKey(imageB64)); found {
        return cachedResult.(string), nil
    }

    payload := RequestPayload{
        Model: "meta/llama-3.2-90b-vision-instruct",
        Messages: []Message{
            {
                Role: "user",
                Content: fmt.Sprintf(
                    "Analyze the image below for any potential threats to public safety. "+
                        "Please respond with 'dangerous' if a threat is detected, or 'not dangerous' otherwise. "+
                        "Include a description if a threat is present. "+
                        "<img src=\"data:image/png;base64,%s\" />",
                    imageB64),
            },
        },
        MaxTokens:   512,
        Temperature: 0,
        TopP:        1.00,
    }

    jsonPayload, err := json.Marshal(payload)
    if err != nil {
        return "", err
    }

    req, err := http.NewRequest("POST", invokeURL, bytes.NewBuffer(jsonPayload))
    if err != nil {
        return "", err
    }

    req.Header.Set("Authorization", "Bearer "+API_KEY)
    req.Header.Set("Accept", "application/json")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return "", fmt.Errorf("request failed with status: %s", resp.Status)
    }

    var response ResponsePayload
    if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
        return "", err
    }

    if len(response.Choices) > 0 {
        result := response.Choices[0].Message.Content
        c.Set(generateCacheKey(imageB64), result, cache.DefaultExpiration) // Cache the result
        return result, nil
    }

    return "", fmt.Errorf("no valid response from model")
}

func detectThreat(w http.ResponseWriter, r *http.Request) {
    // Read the image file from the request
    file, _, err := r.FormFile("file")
    if err != nil {
        http.Error(w, "Failed to get file", http.StatusBadRequest)
        return
    }
    defer file.Close()

    // Read the file contents
    contents, err := ioutil.ReadAll(file)
    if err != nil {
        http.Error(w, "Failed to read file", http.StatusInternalServerError)
        return
    }

    imageB64 := base64.StdEncoding.EncodeToString(contents)

    if len(imageB64) >= 180000 {
        http.Error(w, "To upload larger images, use the assets API (see docs)", http.StatusBadRequest)
        return
    }

    result, err := getThreatAnalysis(imageB64)
    if err != nil {
        http.Error(w, "Error analyzing image: "+err.Error(), http.StatusInternalServerError)
        return
    }

    alert := "not dangerous"
    if containsDangerous(result) {
        alert = "dangerous"
    }

    response := map[string]interface{}{
        "alert": alert,
    }

    if alert == "dangerous" {
        response["description"] = result
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func containsDangerous(result string) bool {
    return containsCaseInsensitive(result, "dangerous")
}

func containsCaseInsensitive(str, substr string) bool {
    return strings.Contains(strings.ToLower(str), strings.ToLower(substr))
}

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/detect-threat/", detectThreat).Methods("POST")

    fmt.Println("Server started at http://127.0.0.1:8000")
    log.Fatal(http.ListenAndServe(":8000", r))
}
