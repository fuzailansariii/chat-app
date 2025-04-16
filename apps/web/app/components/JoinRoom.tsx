import { zodResolver } from "@hookform/resolvers/zod";
import { JoinRoomSchema } from "@repo/common/schema";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type JoinRoom = z.infer<typeof JoinRoomSchema>;

interface JoinRoomProps {
  modelRef: React.RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  type: string;
  placeholder: string;
  title: string;
}

export default function JoinRoom({
  modelRef,
  handleCloseModal,
  type,
  placeholder,
  title,
}: JoinRoomProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JoinRoom>({
    resolver: zodResolver(JoinRoomSchema),
  });

  const onSubmit = async (data: JoinRoom) => {
    try {
      console.log("Room Joined with this id: ", data);
      reset();
      handleCloseModal();
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data.message;
      }
      console.log(errorMessage);
    }
  };

  return (
    <dialog ref={modelRef} className="modal">
      <div className="modal-box p-10">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleCloseModal}
        >
          ✕
        </button>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* if there is a button in form, it will close the modal */}

          <h3 className="font-bold text-lg">{title}</h3>
          <div className="flex flex-col gap-4 mt-4 justify-center items-center">
            <input
              {...register("joiningId")}
              type={type}
              placeholder={placeholder}
              className="input input-bordered w-full md:w-2/3 rounded-md"
            />
            {errors.joiningId && (
              <p className="text-red-500 text-sm">
                {errors.joiningId?.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-outline w-full md:w-2/3 rounded-md"
            >
              {isSubmitting ? "Joining..." : "Join Room"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
