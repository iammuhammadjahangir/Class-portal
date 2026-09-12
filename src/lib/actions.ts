"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { TaskType, MaterialTag } from "@prisma/client";
import { sanitizeRichText, isBlankRichText } from "@/lib/sanitizeHtml";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("Not authorized.");
  return session.user;
}

async function requireStudent() {
  const session = await auth();
  if (!session?.user) throw new Error("Not authorized.");
  return session.user;
}

// ---------- Student-facing ----------

export async function toggleTaskCompletion(taskId: string, completed: boolean, subjectId?: string) {
  const user = await requireStudent();
  await prisma.taskCompletion.upsert({
    where: { taskId_studentId: { taskId, studentId: user.id } },
    update: { completed, completedAt: completed ? new Date() : null },
    create: { taskId, studentId: user.id, completed, completedAt: completed ? new Date() : null },
  });
  revalidatePath("/dashboard");
  if (subjectId) revalidatePath(`/dashboard/subjects/${subjectId}`);
}

// ---------- Subjects ----------

export async function createSubject(data: { name: string; guideName?: string; description?: string }) {
  await requireAdmin();
  if (!data.name.trim()) throw new Error("Subject name is required.");
  const count = await prisma.subject.count();
  await prisma.subject.create({
    data: {
      name: data.name.trim(),
      guideName: data.guideName?.trim() || null,
      description: data.description?.trim() || null,
      order: count,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function updateSubject(
  id: string,
  data: { name: string; guideName?: string; description?: string }
) {
  await requireAdmin();
  await prisma.subject.update({
    where: { id },
    data: {
      name: data.name.trim(),
      guideName: data.guideName?.trim() || null,
      description: data.description?.trim() || null,
    },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/subjects/${id}`);
  revalidatePath("/dashboard");
}

export async function deleteSubject(id: string) {
  await requireAdmin();
  await prisma.subject.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

// ---------- Materials (course content / slides) ----------

export async function createMaterial(data: {
  subjectId: string;
  title: string;
  description?: string;
  tag: MaterialTag;
  fileUrl?: string;
  linkUrl?: string;
}) {
  await requireAdmin();
  if (!data.title.trim()) throw new Error("Title is required.");
  await prisma.material.create({
    data: {
      subjectId: data.subjectId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      tag: data.tag,
      fileUrl: data.fileUrl || null,
      linkUrl: data.linkUrl || null,
    },
  });
  revalidatePath(`/admin/subjects/${data.subjectId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/subjects/${data.subjectId}`);
}

export async function deleteMaterial(id: string, subjectId: string) {
  await requireAdmin();
  await prisma.material.delete({ where: { id } });
  revalidatePath(`/admin/subjects/${subjectId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/subjects/${subjectId}`);
}

// ---------- Tasks (assignments / quizzes / tasks) ----------

export async function createTask(data: {
  subjectId: string;
  title: string;
  description?: string;
  type: TaskType;
  dueDate?: string;
  fileUrl?: string;
  linkUrl?: string;
}) {
  await requireAdmin();
  if (!data.title.trim()) throw new Error("Title is required.");
  const description = data.description && !isBlankRichText(data.description) ? sanitizeRichText(data.description) : null;
  await prisma.task.create({
    data: {
      subjectId: data.subjectId,
      title: data.title.trim(),
      description,
      type: data.type,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      fileUrl: data.fileUrl || null,
      linkUrl: data.linkUrl || null,
    },
  });
  revalidatePath(`/admin/subjects/${data.subjectId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/subjects/${data.subjectId}`);
}

export async function deleteTask(id: string, subjectId: string) {
  await requireAdmin();
  await prisma.task.delete({ where: { id } });
  revalidatePath(`/admin/subjects/${subjectId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/subjects/${subjectId}`);
}

// ---------- Roster ----------

export async function addStudent(data: { name: string; rollNumber: string; isAdmin?: boolean }) {
  await requireAdmin();
  const rollNumber = data.rollNumber.trim().toUpperCase();
  if (!data.name.trim() || !rollNumber) throw new Error("Name and roll number are required.");
  await prisma.student.create({
    data: { name: data.name.trim(), rollNumber, isAdmin: !!data.isAdmin },
  });
  revalidatePath("/admin/roster");
}

export async function removeStudent(id: string) {
  await requireAdmin();
  await prisma.student.delete({ where: { id } });
  revalidatePath("/admin/roster");
}

export async function resetStudentPassword(id: string) {
  await requireAdmin();
  await prisma.student.update({ where: { id }, data: { passwordHash: null, claimedAt: null } });
  revalidatePath("/admin/roster");
}
