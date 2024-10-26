import { Bell, AlertCircle, Radio, History, Settings } from "lucide-react";

const routes = [
  {
    path: '/dashboard',
    icon: AlertCircle,
    label: 'Home',
  },
  {
    path: '/dashboard/live',
    icon: Radio,
    label: 'Live',
  },
  {
    path: '/dashboard/alerts',
    icon: AlertCircle,
    label: 'Alerts',
  }
];

export default routes;
