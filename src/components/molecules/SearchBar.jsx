import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ value, onChange, onSubmit, placeholder, formClassName, inputClassName, buttonClassName, motionDelay = 0.2 }) => {
    return (
        <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: motionDelay }}
            onSubmit={onSubmit}
            className={formClassName}
        >
            <div className="relative">
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={inputClassName}
                />
                <Button
                    type="submit"
                    className={buttonClassName}
                >
                    <ApperIcon name="Search" size={20} />
                </Button>
            </div>
        </motion.form>
    );
};

export default SearchBar;