import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { FiX } from "react-icons/fi";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const CsvFileUpload = ({
  onChange,
  onDrop: onDropProp,
  file: externalFile,
  onRemoveFile,
  accept = ".csv",
}) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Sync with external file
  useEffect(() => {
    if (externalFile) {
      setFiles([externalFile]);
    } else {
      setFiles([]);
    }
  }, [externalFile]);

  const handleFileChange = (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      setFiles([file]);
      if (onChange) {
        // Create synthetic event for compatibility
        const syntheticEvent = {
          target: {
            files: [file],
          },
        };
        onChange(syntheticEvent);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles);
        if (onDropProp) {
          // Create synthetic event for compatibility
          const syntheticEvent = {
            dataTransfer: {
              files: acceptedFiles,
            },
          };
          onDropProp(syntheticEvent);
        }
      }
    },
    onDropRejected: (error) => {
      console.log("File rejected:", error);
    },
  });

  const handleRemove = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemoveFile) {
      onRemoveFile();
    }
  };

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-xl cursor-pointer w-full relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 hover:border-cyan-400 transition-all"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-30">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center relative z-10">
          <p className="relative z-20 font-sans font-bold text-gray-800 text-lg mb-1">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-gray-600 text-sm mb-6">
            Drag or drop your CSV file here or click to upload
          </p>
          <div className="relative w-full mt-4 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-lg",
                    "shadow-lg border-2 border-cyan-200"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-gray-800 font-semibold truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <div className="flex items-center gap-3">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-lg px-3 py-1 w-fit shrink-0 text-sm text-cyan-600 bg-cyan-50 font-medium"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                      {onRemoveFile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove();
                          }}
                          className="text-gray-500 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                        >
                          <FiX className="text-xl" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-gray-600">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 font-medium"
                    >
                      {file.type || "text/csv"}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-lg",
                  "shadow-lg border-2 border-cyan-300"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-cyan-600 flex flex-col items-center font-semibold"
                  >
                    Drop it
                    <IconUpload className="h-5 w-5 text-cyan-600 mt-1" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-8 w-8 text-cyan-600" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border-2 border-dashed border-cyan-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-lg"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-transparent shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-cyan-100/50"
                  : "bg-cyan-200/30 shadow-[0px_0px_1px_2px_rgba(6,182,212,0.3)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
