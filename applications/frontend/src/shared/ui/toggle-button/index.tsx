import { ButtonHTMLAttributes } from 'react'

import classes from './styles.module.css'

export const Button = ({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={classes.button} {...props}>
      {children}
    </button>
  )
}
