// import { Popover } from "radix-ui";
import { IoList } from "react-icons/io5";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export interface IconButtonMenuProps {
  isCollapsed?: boolean;
  children: React.ReactNode;
}

export const IconButtonMenu = ({ children }: IconButtonMenuProps) => {
  return (
    <div>
      <Popover className="relative inline-block">
        <PopoverButton className="h-12 w-12 bg-gray-300 transition duration-200 ease-in-out hover:bg-gray-400 focus:bg-gray-400 drop-shadow-md rounded-full text-md font-semibold text-black/50">
          <div className="flex w-full h-full items-center justify-center">
            <IoList height={32} width={32} />
          </div>
        </PopoverButton>
        <PopoverPanel
          portal={false}
          transition
          className="PopoverContent absolute right-0 top-full mt-2 p-4 rounded-xl shadow-lg transition duration-200 ease-in-out data-closed:-translate-y-1 data-closed:opacity-0"
        >
          {children}
        </PopoverPanel>
      </Popover>
    </div>
  );
};
