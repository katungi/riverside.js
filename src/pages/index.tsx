export const getServerSideProps = () => {
  return { message: "Hello from the server!" };
};

type Props = {
  message: string;
};

const Homepage = ({ message }: Props) => {
  console.log(message);
  return <div onClick={() => console.log("hello")}>{message}</div>;
};

export default Homepage;