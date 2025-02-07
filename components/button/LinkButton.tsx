import Link from "next/link";
import {HTMLProps} from "react";

interface buttonLinkProps extends HTMLProps<HTMLProps<HTMLButtonElement>>{
    link: string,
    buttonType: "menu"

}

const linkButton: React.FC = ({ link, buttonType, ...props }: buttonLinkProps) => {
    return(
        <Link className={
            buttonType === 'menu' ? "menuButton" :
                ''
        } href={link}>

        </Link>
    )
};