import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import {useCategory} from "@hooks/modules/useCategory.ts";
// @ts-ignore
import { cn } from '@utils/cn';
// @ts-ignore
import { ICategory } from "@types/category/Category.res.type";
import { motion, AnimatePresence } from 'framer-motion';

interface UpdateProps {
    open: boolean;
    recordId: string;
    category: ICategory | null;
    onCancel: () => void;
    onSuccess: () => void;
    updateCategory: ReturnType<typeof useMutation>;
}

export const UpdateCom
    = ({ open, recordId, category, onCancel, onSuccess, updateCategory }: UpdateProps) => {
    const formRef = useRef<HTMLFormElement>(null);
    const { getCategory } = useCategory();
    // useEffect(() => {
    //     if (category) {
    //         const fields = formRef.current?.querySelectorAll('input, textarea');
    //         if (fields) {
    //             fields.forEach(field => {
    //                 const name = field.getAttribute('name');
    //                 if (name && category.hasOwnProperty(name)) {
    //                     (field as HTMLInputElement).value = category[name as keyof ICategory] as string;
    //                 }
    //             });
    //         }
    //     }
    // }, [category]);

    useEffect(() => {
        let isMounted = true;
        if (open && recordId) {
            getCategory.mutateAsync(recordId, {
                onSuccess: (data) => {
                    if (!isMounted) return;
                    if (data) {
                        const fields = formRef.current?.querySelectorAll('input, textarea');
                        if (fields) {
                            fields.forEach(field => {
                                const name = field.getAttribute('name');
                                if (name && data.data?.hasOwnProperty(name)) {
                                    (field as HTMLInputElement).value = data.data[name as keyof ICategory]?.toString();
                                }
                            });
                        }
                    }
                },
                onError: (error) => {
                    if (!isMounted) return;
                    console.error('Failed to fetch category:', error);
                }
            });
        }
        return () => {
            isMounted = false;
        };
    }, [open, recordId]);



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!category) return;

        try {
            const formData = new FormData(event.currentTarget);
            const values = Object.fromEntries(formData);
            await updateCategory.mutateAsync(
                {
                    id: category.id,
                    params: values
                },
                {
                    onSuccess: () => {
                        formRef.current?.reset();
                        onSuccess();
                    },
                }
            );
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className={cn('fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="flex items-center justify-center h-full">
                        <motion.form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className={cn('bg-pro-max text-gray-900 rounded-lg p-8 shadow-2xl transform' +
                                ' transition-transform' +
                                ' duration-300', open ? 'scale-100' : 'scale-95')}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                        >
                            <label htmlFor="name" className="block mb-2 font-semibold text-xl text-white">
                                Tên danh mục
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="block w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                placeholder="Nhập tên danh mục"
                            />
                            <div className="flex items-center justify-end mt-6 space-x-2">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 ml-2 text-white bg-amber-400 rounded-md hover:bg-amber-600 transition-colors duration-200"
                                    disabled={updateCategory.isPending}
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};