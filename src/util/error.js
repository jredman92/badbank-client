import "./page.css";

export default function Error(props) {
   return (
      <div
         className="error-container"
         style={{ top: props.position.top, right: props.position.right }}
      >
         <div className="error-message">{props.message}</div>
      </div>
   );
}
