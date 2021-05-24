import React from 'react'

export const FormGroup: React.FC<{ label?: string, colMd?: string }> = ({ children, label, colMd = "12" }) => {
    return <div className={`mb-2 col-md-${colMd}`}>
        {label && <label htmlFor="">{label}</label>}
        {children}
    </div>

}