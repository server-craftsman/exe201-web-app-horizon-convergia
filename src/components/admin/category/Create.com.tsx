import { useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
// @ts-ignore
import { cn } from '@utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

type CreateProps = {
    open: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    createCategory: ReturnType<typeof useMutation>;
};

export const CreateCom = ({ open, onCancel, onSuccess, createCategory }: CreateProps) => {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.currentTarget);
            const values = Object.fromEntries(formData);
            await createCategory.mutateAsync(values as Record<string, string>, {
                onSuccess: () => {
                    formRef.current?.reset();
                    onSuccess();
                },
            });
        } catch (error) {
            console.error('Validation failed:', error);
        }
    }, [createCategory, onSuccess]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex justify-center items-center h-full">
                        <motion.form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className={cn('bg-pro-max text-gray-900 rounded-lg p-12 shadow-xl transform' +
                                ' transition-transform' +
                                ' duration-300')}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label htmlFor="name" className="block mb-2 font-semibold text-lg text-white">
                                Tên danh mục
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="input-primary"
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
                                    disabled={createCategory.isPending}
                                >
                                    Tạo
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};