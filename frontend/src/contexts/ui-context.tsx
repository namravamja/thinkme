"use client"

import type React from "react"

import { create } from "zustand"

interface UIState {
  isCreateModalOpen: boolean
  isDeleteModalOpen: boolean
  selectedBlogId: string | null
  openCreateModal: () => void
  closeCreateModal: () => void
  openDeleteModal: (blogId: string) => void
  closeDeleteModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isCreateModalOpen: false,
  isDeleteModalOpen: false,
  selectedBlogId: null,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  openDeleteModal: (blogId: string) => set({ isDeleteModalOpen: true, selectedBlogId: blogId }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedBlogId: null }),
}))

export function UIProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
