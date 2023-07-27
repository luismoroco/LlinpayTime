export default function NanPercent(props) {
  const { nan } = props;
  let color = ""; 
  if (nan <= 5) {
    color = "green";
  } else if (nan > 5 && nan <= 10) {
    color = "orange";
  } else if (nan >= 20) {
    color = "red";
  }

  return (
    <p className={`font-medium text-${String(color)}-600`}>{`${nan} %`}</p>
  );
}  