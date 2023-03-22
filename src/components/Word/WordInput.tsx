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
  valuesArray: z.array(z.any()),
  placeHolder: z.string().optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
  index: z.number(),
  removeInput: z.function().args(z.number()).returns(z.void()).optional(),
});

type WordInputProps = z.infer<typeof wordInputValidator>;

// input component with cancel button on the right side
export const WordInputWithCancel: React.FC<WordInputProps> = ({
  index,
  valuesArray,
  value,
  setValue,
  placeHolder,
  onChange,
  removeInput,
}) => {
  return (
    <div className="relative flex w-full flex-row" key={index}>
      <input
        type="text"
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        placeholder={placeHolder ? placeHolder : "Enter words mean"}
        value={value}
        onChange={(e) => {
          e.preventDefault();
          setValue(e.target.value);
          onChange && onChange(e.target.value);
        }}
      />
      {/* if value is empty remove */}
      {(value || valuesArray.length > 1) && (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        <button
          tabIndex={-1}
          type="button"
          className="absolute right-0 top-0 mt-2 mr-2 rounded-full bg-red-500 p-1 px-2"
          onClick={(e) => {
            e.preventDefault();
            // if value is not empty, remove input
            if (value) {
              setValue("");
            } else if (valuesArray.length > 1 && !value) {
              removeInput && removeInput(index);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const tagInputValidator = z.object({
  value: z.string().min(2),
  setValue: z.function().args(z.string()).returns(z.void()),
  placeHolder: z.string().optional(),
  onChange: z.function().args(z.string()).returns(z.void()).optional(),
  key: z.number(),
});

type TagInputProps = z.infer<typeof tagInputValidator>;
// Tag input component for tags showcase
export const TagInput: React.FC<TagInputProps> = ({
  key,
  value,
  setValue,
  placeHolder,
  onChange,
}) => {
  return (
    <div className="relative flex w-full flex-row" key={key}>
      <input
        type="text"
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        placeholder={placeHolder ? placeHolder : "Enter words mean"}
        value={value}
        onChange={(e) => {
          e.preventDefault();
          setValue(e.target.value);
          onChange && onChange(e.target.value);
        }}
      />
    </div>
  );
};
