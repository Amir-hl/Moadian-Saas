import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  Receipt,
  Scale,
  Building2,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'مدیر سیستم',
    email: 'admin@moadian-saas.ir',
    avatar: '/avatars/shadcn.jpg',
  },

  teams: [
    {
      name: 'سامانه مودیان',
      logo: Building2,
      plan: 'نسخه شرکتی',
    },
  ],

  navGroups: [
    {
      title: 'داشبورد',
      items: [
        {
          title: 'صفحه اصلی',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'تسک ها',
          url: '/tasks',
          icon: ListTodo,
          hidden: true, // پنهان اما حفظ‌شده برای ابزارهای بعدی
        },
      ],
    },

    {
      title: 'مدیریت صورتحساب و فروش',
      items: [
        {
          title: 'فاکتورها',
          url: '/invoices',
          icon: Receipt,
        },
        {
          title: 'مشتریان',
          url: '/customers',
          icon: Users,
        },
        {
          title: 'کالاها و خدمات',
          url: '/products',
          icon: Package,
        },
        {
          title: 'واحدهای سنجش',
          url: '/units',
          icon: Scale,
        },
      ],
    },

    {
      title: 'تنظیمات سیستم',
      items: [
        {
          title: 'تنظیمات',
          icon: Settings,
          items: [
            {
              title: 'اطلاعات شرکت و مودیان',
              url: '/settings/company',
              icon: Building2,
            },
            {
              title: 'پروفایل کاربری',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'حساب کاربری',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'ظاهر و قالب',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'اعلان‌ها',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'نمایشگر',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'مرکز راهنما',
          url: '/help-center',
          icon: HelpCircle,
          hidden: true,
        },
      ],
    },

    // منوهای جانبی قالب - پنهان‌شده بدون حذف کدهای داخلی
    {
      title: 'برنامه‌های جانبی',
      hidden: true,
      items: [
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
          hidden: true,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
          hidden: true,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
          hidden: true,
        },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          hidden: true,
          items: [
            {
              title: 'Sign In',
              url: '/clerk/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/clerk/sign-up',
            },
            {
              title: 'User Management',
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },

    {
      title: 'صفحات سیستمی',
      hidden: true,
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          hidden: true,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          hidden: true,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
  ],
}
