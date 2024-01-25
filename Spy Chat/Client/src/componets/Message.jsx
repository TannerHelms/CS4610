import MessageContent from "./MessageContent";

function Message({ message, error, setError }) {
  return (
    <div className="messageContainer">
      <p>{message.user}</p>
      <MessageContent
        data={message.data}
        onError={(error) => {
          setError(error);
        }}
        onSuccess={() => {
          setError("");
        }}
      />
      <p>{message.date}</p>
    </div>
  );
}

export default Message;
