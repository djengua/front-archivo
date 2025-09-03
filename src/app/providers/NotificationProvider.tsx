// src/app/providers/NotificationProvider.tsx
"use client";

import { Snackbar, Alert, AlertTitle, Slide, SlideProps } from "@mui/material";
import { useUiStore } from "../../stores/uiStore";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { notifications, removeNotification } = useUiStore();

  const handleClose = (notificationId: string) => {
    removeNotification(notificationId);
  };

  return (
    <>
      {children}

      {/* Stack de notificaciones */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999 }}>
        {notifications.map((notification, index) => (
          <Snackbar
            key={notification.id}
            open={true}
            autoHideDuration={
              notification.autoHide ? notification.duration : null
            }
            onClose={() => handleClose(notification.id)}
            TransitionComponent={SlideTransition}
            style={{
              position: "relative",
              marginBottom: index > 0 ? 8 : 0,
            }}
          >
            <Alert
              severity={notification.type}
              onClose={() => handleClose(notification.id)}
              sx={{ minWidth: 300 }}
            >
              {notification.title && (
                <AlertTitle>{notification.title}</AlertTitle>
              )}
              {notification.message}
            </Alert>
          </Snackbar>
        ))}
      </div>
    </>
  );
}
