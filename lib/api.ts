import axios from "axios";
import type { Note } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api/";
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const api = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${token}` },
});
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string,
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search,
    },
  });
  return response.data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">,
): Promise<Note> => {
  const response = await api.post<Note>("/notes", note);

  return response.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${noteId}`);

  return response.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${noteId}`);
  return response.data;
};
