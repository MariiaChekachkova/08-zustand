"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { NoteTag } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),

  content: Yup.string().max(500, "Content must be at most 500 characters"),

  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });
  return (
    <Formik<NoteFormValues>
      initialValues={{
        title: "",
        content: "",
        tag: "Personal",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        createMutation.mutate(values, {
          onSuccess: () => {
            actions.resetForm();
          },
        });
      }}
    >
      <Form className={css.form}>
        <label className={css.formGroup}>
          Title
          <Field className={css.input} name="title" />
          <ErrorMessage name="title" component="span" className={css.error} />
        </label>

        <label className={css.formGroup}>
          Content
          <Field className={css.textarea} as="textarea" name="content" />
          <ErrorMessage name="content" component="span" className={css.error} />
        </label>

        <label className={css.formGroup}>
          Tag
          <Field className={css.select} as="select" name="tag">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </label>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>

          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
