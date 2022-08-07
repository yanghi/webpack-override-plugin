import React from 'react'

export interface ButtonProps {
    type: string;
}

const Button: React.FC<ButtonProps> = (props)=>{

const { type } = props



return <div>{type}</div>
}

export default Button