import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRoomSchema } from "@repo/common/schema";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CreateRoom = z.infer<typeof CreateRoomSchema>;

interface CreateRoomProps {
  modelRef: React.RefObject<HTMLDialogElement | null>;
  handleCloseModal: () => void;
  type: string;
  placeholder: string;
  title: string;
}

export default function CreateRoom({
  modelRef,
  handleCloseModal,
  type,
  placeholder,
  title,
}: CreateRoomProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof CreateRoomSchema>>({
    resolver: zodResolver(CreateRoomSchema),
  });

  const onSubmit = async (data: z.infer<typeof CreateRoomSchema>) => {
    try {
      const response = await axios.post("/api/create-room", data);
      //   console.log(response);
      if (axios.isAxiosError(response)) {
        console.log(response.response?.data);
      } else {
        // TODO: redirect to the room page
        // TODO: show a success toast message
        console.log(response.data);
      }
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
              {...register("name")}
              type="text"
              placeholder="Room Name"
              className="input input-bordered w-full md:w-2/3 rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
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
