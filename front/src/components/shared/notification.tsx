
import * as React from "react"
import { Bell } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios"


export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await apiClient.get("/api/notifications");
      return response.data;
    },
  });
};

export const useMarkNotificationAsAccessed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiClient.put(`/api/notifications/${notificationId}/accessed`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
export function NotificationDropdown() {
  const [open, setOpen] = React.useState(false)
  const { data: notifications = [], isLoading } = useNotifications()
  const markAsAccessed = useMarkNotificationAsAccessed()

  const unreadCount = notifications.filter((n: any) => !n.accessed).length

  const handleNotificationClick = (id: number) => {
    markAsAccessed.mutate(id)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                notifications.forEach((n: any) => {
                  if (!n.accessed) markAsAccessed.mutate(n.notification_id)
                })
              }
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <DropdownMenuItem
                key={notification.notification_id}
                className={`flex items-start gap-3 p-3 cursor-pointer ${
                  !notification.accessed ? "bg-muted/50" : ""
                }`}
                onClick={() => handleNotificationClick(notification.notification_id)}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">System</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.sent_date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
                {!notification.accessed && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1"></div>}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}