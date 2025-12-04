import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../utils';

const SlideOver = DialogPrimitive.Root;

const SlideOverTrigger = DialogPrimitive.Trigger;

const SlideOverClose = DialogPrimitive.Close;

const SlideOverPortal = DialogPrimitive.Portal;

const SlideOverOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
SlideOverOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface SlideOverContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
};

const SlideOverContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SlideOverContentProps
>(({ className, children, side = 'right', size = 'lg', ...props }, ref) => (
  <SlideOverPortal>
    <SlideOverOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 gap-4 bg-background shadow-lg transition ease-in-out',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:duration-300 data-[state=open]:duration-300',
        'inset-y-0 h-full w-full flex flex-col',
        sizeClasses[size],
        side === 'right' && [
          'right-0',
          'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        ],
        side === 'left' && [
          'left-0',
          'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        ],
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </SlideOverPortal>
));
SlideOverContent.displayName = DialogPrimitive.Content.displayName;

const SlideOverHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 p-4 border-b shrink-0',
      className
    )}
    {...props}
  />
);
SlideOverHeader.displayName = 'SlideOverHeader';

const SlideOverFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex items-center justify-end gap-2 p-4 border-t shrink-0',
      className
    )}
    {...props}
  />
);
SlideOverFooter.displayName = 'SlideOverFooter';

const SlideOverTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
SlideOverTitle.displayName = DialogPrimitive.Title.displayName;

const SlideOverDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SlideOverDescription.displayName = DialogPrimitive.Description.displayName;

const SlideOverBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex-1 overflow-y-auto p-4', className)}
    {...props}
  />
);
SlideOverBody.displayName = 'SlideOverBody';

// Convenience component for simple slide-overs
interface SimpleSlideOverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function SimpleSlideOver({
  open,
  onOpenChange,
  title,
  description,
  side = 'right',
  size = 'lg',
  children,
  footer,
}: SimpleSlideOverProps) {
  return (
    <SlideOver open={open} onOpenChange={onOpenChange}>
      <SlideOverContent side={side} size={size}>
        <SlideOverHeader>
          <div className="flex items-center justify-between">
            <div>
              <SlideOverTitle>{title}</SlideOverTitle>
              {description && (
                <SlideOverDescription>{description}</SlideOverDescription>
              )}
            </div>
            <SlideOverClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </SlideOverClose>
          </div>
        </SlideOverHeader>
        <SlideOverBody>{children}</SlideOverBody>
        {footer && <SlideOverFooter>{footer}</SlideOverFooter>}
      </SlideOverContent>
    </SlideOver>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export {
  SlideOver,
  SlideOverPortal,
  SlideOverOverlay,
  SlideOverTrigger,
  SlideOverClose,
  SlideOverContent,
  SlideOverHeader,
  SlideOverFooter,
  SlideOverTitle,
  SlideOverDescription,
  SlideOverBody,
  SimpleSlideOver,
  type SlideOverContentProps,
  type SimpleSlideOverProps,
};
