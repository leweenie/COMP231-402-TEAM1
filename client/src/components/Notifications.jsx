import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';

const Notifications = ({ viewerRole }) => {
 
  let dummyNotifications = [];
  if (viewerRole === "Job Poster") {
    dummyNotifications = [
      { id: 1, message: "Superhero Car-Bomb Dioxide applied to your job 'There's a spider in my bathtub!'", opened: false },
      { id: 2, message: "Superhero Firestorm has been hired for your job 'Fire alarm installation'", opened: false },
    ];
  } else if (viewerRole === "Superhero") {
    dummyNotifications = [
      { id: 1, message: "Job Poster Bruce Wayne has hired you for job 'Bat-signal repair'", opened: false },
      { id: 2, message: "Your application for job 'City patrol' was accepted", opened: false },
    ];
  }

  const [notifications, setNotifications] = useState(dummyNotifications);

  const unopenedCount = notifications.filter(n => !n.opened).length;

  const handleSelect = (eventKey) => {
    const id = parseInt(eventKey, 10);
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, opened: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle variant="primary" id="dropdown-notifications">
        Notifications {unopenedCount > 0 && <Badge bg="light" text="dark">{unopenedCount}</Badge>}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <Dropdown.Item key={notification.id} eventKey={notification.id}>
              {notification.message}
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>No Notifications Available</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notifications;
