import clsx from 'clsx';
<<<<<<< HEAD
import { ReactNode, SyntheticEvent } from 'react';
import styles from './form.module.scss';


type FormProps = {
=======
import { DetailedHTMLProps, FormHTMLAttributes, ReactNode, SyntheticEvent } from 'react';
import styles from './form.module.scss';

interface FormProps extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
>>>>>>> admin
	handleFormSubmit?: (e:SyntheticEvent<HTMLFormElement>) => void,
	children: ReactNode,
	extraClass?: string;
	formRef?:  React.RefObject<HTMLFormElement>;
}

<<<<<<< HEAD
export default function Form({handleFormSubmit, children, formRef, extraClass, ...props}: FormProps) {
	return (
		<form ref={formRef}  className={clsx(styles.form, { [extraClass as string]: !!extraClass })} onSubmit={handleFormSubmit} {...props}>
=======
export default function Form({handleFormSubmit, children, extraClass, formRef, ...props}: FormProps) {
	return (
		<form ref={formRef} className={clsx(styles.form, { [extraClass as string]: !!extraClass })} onSubmit={handleFormSubmit} {...props}>
>>>>>>> admin
			{children}
		</form>
	)
}
