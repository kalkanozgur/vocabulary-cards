import { useState } from "react";
import { z } from "zod";
import { FaMicrophone } from "react-icons/fa";

const richWordInputValidator = z.object({
  value: z.string().min(2),
  setValue: z.function().args(z.string()).returns(z.void()),
  placeHolder: z.string().optional(),
  onRecord: z.function().args(z.string()).returns(z.void()),
  setRecordedWord: z.function().args(z.string()).returns(z.void()).optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
  onBlur: z.function().returns(z.void()).optional(),
});

type RichWordInputProps = z.infer<typeof richWordInputValidator>;

export const WordInputwithRich: React.FC<RichWordInputProps> = ({
  onBlur,
  value,
  setValue,
  placeHolder,
  onRecord,
  onChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedWord, setRecordedWord] = useState("");
  return (
    <div className="flex flex-row">
      <div className="relative flex w-full flex-col justify-center">
        <input
          onBlur={onBlur}
          type="text"
          className=" w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          placeholder={placeHolder ? placeHolder : "Enter a word"}
          value={value}
          onChange={(e) => {
            e.preventDefault();
            setValue(e.target.value);
            onChange && onChange(e.target.value);
            // setTranslation();
          }}
        />
      </div>
      <button
        tabIndex={-1}
        type="button"
        className=" flex items-center"
        onSubmit={(e) => {
          e.preventDefault();
          onRecord(recordedWord, setIsRecording, setRecordedWord);
          setValue(recordedWord);
        }}
      >
        <FaMicrophone
          className={`m-3 h-20 w-20 duration-300 hover:scale-150 hover:blur-[1px]  {${
            isRecording ? " z-50 scale-150 text-green-500  " : " text-gray-500"
          }`}
        />
      </button>
    </div>
  );
};

const wordInputValidator = z.object({
  value: z.string().min(2),
  setValue: z.function().args(z.string()).returns(z.void()),
  placeHolder: z.string().optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
});

type WordInputProps = z.infer<typeof wordInputValidator>;

export const WordInput: React.FC<WordInputProps> = ({
  value,
  setValue,
  placeHolder,
  onChange,
}) => {
  return (
    <div className="flex flex-row">
      <div className="relative flex w-full flex-col justify-center">
        <input
          type="text"
          className="form-input"
          placeholder={placeHolder ? placeHolder : "Enter words mean"}
          value={value}
          onChange={(e) => {
            e.preventDefault();
            setValue(e.target.value);
            onChange && onChange(e.target.value);
            // setTranslation();
          }}
        />
      </div>
    </div>
  );
};
