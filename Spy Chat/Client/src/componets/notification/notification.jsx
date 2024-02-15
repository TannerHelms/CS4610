import { useEffect, useState, forceUpdate } from "react";
import classes from "./notification.module.css";

export default function Notification({ text }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (text[0] != "") {
      setShow(false);
      setTimeout(() => {
        setShow(true);
      }, 200);
      const timeout = setTimeout(() => {
        setShow(false);
      }, 5000);
      timeout;
      return () => clearTimeout(timeout);
    }
  }, [text[1]]);

  return !show ? (
    ""
  ) : (
    <div className={classes.notification}>
      <span>{text[0]}</span>
    </div>
  );
}
