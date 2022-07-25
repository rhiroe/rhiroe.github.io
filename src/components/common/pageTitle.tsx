import React, { ReactNode } from 'react'
import styles from "~/styles/Home.module.css";

type HeaderProps = { children: ReactNode }

const pageTitle: React.FC<HeaderProps> = ({ children }) => {
    return (
        <h1 className={styles.title}>{children}</h1>
    )
}

export default pageTitle
