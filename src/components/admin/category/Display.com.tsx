import { useState, useEffect, useCallback } from 'react';
import { cn } from '@utils/cn';
import { useCategory } from "@hooks/modules/useCategory";
// @ts-ignore
import type { ICategory } from '@types/category/Category.res.type';
import { CreateCom } from './Create.com.tsx';
import { UpdateCom } from './Update.com.tsx';
import { motion } from 'framer-motion';
import {helpers} from "@utils/index.ts";

export const DisplayCom = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);

    const {
        getCategorys,
        createCategory,
        updateCategory,
        deleteCategory
    } = useCategory();

    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await getCategorys.mutateAsync();
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    }, [getCategorys]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreateSuccess = useCallback(() => {
        setIsCreateModalVisible(false);
        fetchCategories();
    }, []);

    const handleUpdateSuccess = useCallback(() => {
        setIsUpdateModalVisible(false);
        setSelectedCategory(null);
        fetchCategories();
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteCategory.mutateAsync(id);
            fetchCategories();
        } catch (error) {
            console.error('Delete error:', error);
        }
    }, [deleteCategory, fetchCategories]);

    return (
        <motion.div
            className={cn('container mx-auto p-4')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className={cn('flex justify-between items-center', 'mb-4')}>
                <motion.h2
                    className={cn('text-3xl font-bold text-white', 'tracking-wider')}
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    exit={{ x: 100 }}
                    transition={{ duration: 0.3 }}
                >
                    Danh mục sản phẩm
                </motion.h2>
                <button
                    className={cn('bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-3 rounded-md', 'shadow-2xl', 'hover:shadow-2xl', 'transition-all duration-300')}
                    onClick={() => setIsCreateModalVisible(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tạo danh mục
                </button>
            </div>

            <motion.table
                className={cn('w-full table-auto', 'bg-gray-800', 'rounded-xs', 'overflow-hidden')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.thead
                    className={cn('bg-amber-400')}
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ duration: 0.3 }}
                >
                    <tr>
                        <th className={cn('px-4 py-2', 'text-white text-lg')}>Tên</th>
                        <th className={cn('px-4 py-2', 'text-white text-lg')}>Ngày tạo</th>
                        <th className={cn('px-4 py-2', 'text-white text-lg')}>Hành động</th>
                    </tr>
                </motion.thead>
                <motion.tbody
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {categories.map((category) => (
                        <motion.tr
                            key={category.id}
                            initial={{ x: 100 }}
                            animate={{ x: 0 }}
                            exit={{ x: -100 }}
                            transition={{ duration: 0.3 }}
                        >
                            <td className={cn('border px-4 py-2', 'text-white text-lg')}>{category.name}</td>
                            <td className={cn('border px-4 py-2 text-end', 'text-white text-lg')}>{helpers.formatDate(category.createdAt)}</td>
                            <td className={cn('border px-4 py-2 flex items-center justify-end', 'text-white text-lg')}>
                                <button
                                    className={cn('text-white px-4 py-2 rounded', 'shadow-lg', 'hover:scale-125', 'hover:shadow-xl', 'transition-all duration-300')}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsUpdateModalVisible(true);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>

                                <button
                                    className={cn('text-white px-4 py-2 rounded ml-1', 'shadow-lg', 'hover:scale-125','hover:shadow-xl', 'transition-shadow duration-300')}
                                    onClick={() => handleDelete(category.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </motion.table>

            <CreateCom
                open={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                onSuccess={handleCreateSuccess}
                createCategory={createCategory as any} // Type assertion to avoid type issues
            />

            {selectedCategory && (
                <UpdateCom
                    open={isUpdateModalVisible}
                    category={selectedCategory}
                    recordId={selectedCategory.id}
                    onCancel={() => {
                        setIsUpdateModalVisible(false);
                        setSelectedCategory(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    updateCategory={updateCategory as any} // Type assertion to avoid type issues
                />
            )}
        </motion.div>
    );
};