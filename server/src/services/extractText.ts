import pdf from "pdf-parse";
import mammoth from "mammoth";

export const extractText = async (file: Express.Multer.File): Promise<string> => {
  if (file.mimetype === "application/pdf") {
    const result = await pdf(file.buffer);
    return result.text;
  }

  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result.value;
};