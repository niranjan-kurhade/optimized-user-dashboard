import React, { memo } from "react";
import { useForm } from "react-hook-form";

function AddUserFormBase({ onCreate }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: "", email: "", username: "" },
    mode: "onBlur",
  });

  async function onSubmit(values) {
    await onCreate(values);
    reset();
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Add New User</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label style={styles.label}>
          Name
          <input
            style={styles.input}
            {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 chars" } })}
            placeholder="Jane Doe"
          />
          {errors.name && <span style={styles.error}>{errors.name.message}</span>}
        </label>
        <label style={styles.label}>
          Username
          <input
            style={styles.input}
            {...register("username", { required: "Username is required" })}
            placeholder="jane"
          />
          {errors.username && <span style={styles.error}>{errors.username.message}</span>}
        </label>
        <label style={styles.label}>
          Email
          <input
            style={styles.input}
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            })}
            placeholder="jane@example.com"
          />
          {errors.email && <span style={styles.error}>{errors.email.message}</span>}
        </label>
        <button style={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding…" : "Add User"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: { background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  title: { marginTop: 0 },
  label: { display: "block", marginBottom: 12 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", outline: "none" },
  error: { color: "#c00", fontSize: 12, marginTop: 4, display: "block" },
  button: { marginTop: 8, padding: "10px 14px", borderRadius: 10, background: "#111827", color: "#fff", border: "none", cursor: "pointer" },
};

const AddUserForm = memo(AddUserFormBase);
export default AddUserForm;
