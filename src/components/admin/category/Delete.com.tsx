import {cn} from '@utils/cn';
import { useState } from 'react';
import { useCategory } from "@hooks/modules/useCategory";
import {motion, AnimatePresence} from 'framer-motion';

interface DeleteProps {
    visible: boolean;
    categoryId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const DeleteCom = ({ visible, categoryId, onClose, onSuccess }: DeleteProps) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await useCategory().deleteCategory.mutateAsync(categoryId);
            onSuccess();
        } catch (error) {
            console.error('Failed to delete category:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn('fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50')}
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-md shadow-md p-4 mx-auto mt-24 w-1/2"
                    >
                        <h2 className="text-2xl font-bold mb-2">Delete Category</h2>
                        <p className="mb-4">
                            Are you sure you want to delete this category? This action cannot be undone.
                        </p>
                        <div className="flex justify-end">
                            <button className="px-4 py-2 bg-gray-200 rounded-md mr-2" onClick={onClose}>Cancel</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={handleDelete} disabled={loading}>
                                {loading ? 'Deleting...' : 'Confirm'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};