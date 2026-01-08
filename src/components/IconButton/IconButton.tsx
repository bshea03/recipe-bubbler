import styles from "./styles";

export interface IconButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  onClick: () => void;
}

export const IconButton = ({ icon: Icon, onClick }: IconButtonProps) => {
  return (
    <div
      className="flex flex-wrap content-center items-center bg-gray-300 shadow-lg transform transition duration-200 ease-in-out rounded-full text-gray-800 p-3 h-14 w-14 hover:bg-gray-400 focus:bg-gray-500"
      onClick={onClick}
    >
      <Icon style={styles.icon} />
    </div>
  );
};
