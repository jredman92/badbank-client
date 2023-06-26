export default function Error(props) {
   const errorContainerStyles = {
      position: "absolute",
      backgroundColor: "#ffd9d9",
      color: "red",
      border: "1px solid rgb(255, 0, 0)",
      padding: "10px",
      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
      top: props.position.top,
      left: props.position.left,
      whiteSpace: "nowrap",
      zIndex: "999",
   };

   return (
      <div className="error-container" style={errorContainerStyles}>
         {props.message}
      </div>
   );
}
