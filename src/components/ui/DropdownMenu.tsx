import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface DropdownMenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ElementType;
  danger?: boolean;
}

interface DropdownMenuProps {
  buttonContent: React.ReactNode;
  items: DropdownMenuItem[];
  className?: string;
  buttonClassName?: string;
  align?: "left" | "right";
  hideChevron?: boolean;
}

export default function DropdownMenu({ buttonContent, items, className, buttonClassName, align = "right", hideChevron }: DropdownMenuProps) {
  return (
    <Menu as="div" className={cn("relative inline-block text-left", className)}>
      <MenuButton className={cn(
        "inline-flex w-full justify-center items-center rounded-md bg-white text-sm font-semibold text-slate-900 transition-colors outline-none",
        buttonClassName
      )}>
        {buttonContent}
        {!hideChevron && <ChevronDown aria-hidden="true" className="-mr-1 ml-1.5 h-4 w-4 text-slate-400" />}
      </MenuButton>

      <MenuItems
        transition
        className={cn(
          "absolute z-[100] mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 outline-none transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in overflow-hidden",
          align === "right" ? "right-0" : "left-0"
        )}
      >
        <div className="py-1">
          {items.map((item, index) => {
            const ItemWrapper = item.href ? 'a' : 'button';
            return (
              <MenuItem key={index}>
                <ItemWrapper
                  href={item.href}
                  type={item.href ? undefined : "button"}
                  onClick={item.onClick}
                  className={cn(
                    "group flex w-full items-center px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer data-[focus]:bg-slate-50",
                    item.danger 
                      ? "text-rose-600 data-[focus]:text-rose-700"
                      : "text-slate-700 data-[focus]:text-brand-primary"
                  )}
                >
                  {item.icon && (
                    <item.icon 
                      className={cn(
                        "mr-3 h-4 w-4 transition-colors", 
                        item.danger ? "text-rose-500 group-data-[focus]:text-rose-600" : "text-slate-400 group-data-[focus]:text-brand-primary"
                      )} 
                      aria-hidden="true" 
                    />
                  )}
                  {item.label}
                </ItemWrapper>
              </MenuItem>
            );
          })}
        </div>
      </MenuItems>
    </Menu>
  )
}
