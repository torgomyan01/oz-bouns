import { Button } from "@heroui/react";
import clsx from "clsx";
import { useState } from "react";

function OrderBlockItem() {
    const [isEditing, setIsEditing] = useState(false);


    function saveChanges(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsEditing(false);
    }

    return (
        <form onSubmit={saveChanges} className="flex-jsb-c bg-white rounded-[16px] p-[16px] mb-2 gap-4">
            <input defaultValue={'0158456585-003'} disabled={!isEditing}
                className={clsx("text-[15px] text-[#79838B] font-normal w-full", {
                    "border border-gray-300 rounded-[8px] p-[8px]": isEditing,
                })} />
            {
                isEditing ? (
                    <button type="submit" className="fa-solid fa-check text-green-500 text-[18px]" onClick={() => setIsEditing(false)}></button>
                ) : (
                    <i className="fa-solid fa-pen text-black/50! text-[16px]" onClick={() => setIsEditing(true)}></i>
                )
            }
        </form>
    );
}

export default OrderBlockItem;