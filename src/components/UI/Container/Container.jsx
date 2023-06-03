import classes from './Container.module.css';

export default function Container({ className, children }) {
  const containerClasses = className
    ? `${classes.container} ${className}`
    : classes.container;

  return <div className={containerClasses}>{children}</div>;
}
