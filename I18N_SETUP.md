# Internationalization (i18n) Setup

This project now supports internationalization with three languages: English (en), Uzbek (uz), and Russian (ru).

## 🚀 Features

- ✅ **3 Languages Supported**: English, Uzbek, Russian
- ✅ **URL-based Language Switching**: `/en/`, `/uz/`, `/ru/`
- ✅ **Language Switcher Component**: Easy language selection
- ✅ **Translation Context**: React context for managing locale
- ✅ **Type-safe Translations**: TypeScript support
- ✅ **Fallback Support**: Graceful fallback to English

## 📁 File Structure

```
src/
├── lib/
│   ├── translations/
│   │   ├── en.ts          # English translations
│   │   ├── uz.ts          # Uzbek translations
│   │   ├── ru.ts          # Russian translations
│   │   └── index.ts       # Translation utilities
│   └── locale-context.tsx # React context for locale
├── components/
│   └── LanguageSwitcher.tsx # Language selection component
└── app/
    └── layout.tsx         # Root layout with providers
```

## 🔧 Configuration

### Next.js Config
The `next.config.mjs` file includes i18n configuration:

```javascript
i18n: {
  locales: ['en', 'uz', 'ru'],
  defaultLocale: 'en',
  localeDetection: true,
}
```

### URL Structure
- English (default): `/` or `/en/`
- Uzbek: `/uz/`
- Russian: `/ru/`

## 🎯 Usage

### 1. Using Translations in Components

```tsx
import { useLocale } from '@/lib/locale-context';
import { useTranslation } from '@/lib/translations';

function MyComponent() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale);

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  );
}
```

### 2. Adding Language Switcher

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocale } from '@/lib/locale-context';

function NavigationBar() {
  const { locale } = useLocale();

  return (
    <nav>
      {/* Your navigation content */}
      <LanguageSwitcher currentLocale={locale} />
    </nav>
  );
}
```

### 3. Adding New Translations

1. **Add to English file** (`src/lib/translations/en.ts`):
```typescript
export const en = {
  // ... existing translations
  newSection: {
    title: "New Section Title",
    description: "New section description"
  }
};
```

2. **Add to Uzbek file** (`src/lib/translations/uz.ts`):
```typescript
export const uz = {
  // ... existing translations
  newSection: {
    title: "Yangi bo'lim sarlavhasi",
    description: "Yangi bo'lim tavsifi"
  }
};
```

3. **Add to Russian file** (`src/lib/translations/ru.ts`):
```typescript
export const ru = {
  // ... existing translations
  newSection: {
    title: "Название нового раздела",
    description: "Описание нового раздела"
  }
};
```

### 4. Using Nested Translation Keys

```tsx
// Access nested properties
t('hero.stats.students')  // "Happy Students"
t('programs.elementary.title')  // "Elementary Program"
```

## 🌐 Available Translation Keys

### Navigation
- `nav.home` - Home
- `nav.about` - About
- `nav.programs` - Programs
- `nav.events` - Events
- `nav.contact` - Contact
- `nav.login` - Log in
- `nav.applyNow` - Apply Now

### Hero Section
- `hero.title` - Main title
- `hero.subtitle` - Subtitle
- `hero.description` - Description
- `hero.explorePrograms` - Explore Programs button
- `hero.scheduleTour` - Schedule Tour button
- `hero.stats.students` - Students count label
- `hero.stats.years` - Years count label
- `hero.stats.programs` - Programs count label

### About Section
- `about.title` - Section title
- `about.description` - Section description
- `about.mission.title` - Mission title
- `about.mission.content` - Mission content
- `about.vision.title` - Vision title
- `about.vision.content` - Vision content
- `about.values.title` - Values title
- `about.values.excellence.title` - Excellence value title
- `about.values.excellence.description` - Excellence value description
- `about.values.innovation.title` - Innovation value title
- `about.values.innovation.description` - Innovation value description
- `about.values.compassion.title` - Compassion value title
- `about.values.compassion.description` - Compassion value description
- `about.values.integrity.title` - Integrity value title
- `about.values.integrity.description` - Integrity value description

### Programs Section
- `programs.title` - Section title
- `programs.description` - Section description
- `programs.elementary.*` - Elementary program translations
- `programs.middle.*` - Middle school program translations
- `programs.high.*` - High school program translations
- `programs.stem.*` - STEM program translations
- `programs.arts.*` - Arts program translations
- `programs.athletics.*` - Athletics program translations
- `programs.keyFeatures` - Key features label
- `programs.learnMore` - Learn more button
- `programs.cta.*` - Call to action translations

### Events Section
- `events.title` - Section title
- `events.description` - Section description
- `events.categories.*` - Event category translations
- `events.learnMore` - Learn more button
- `events.viewAllEvents` - View all events button
- `events.expectedAttendees` - Expected attendees label

### Contact Section
- `contact.title` - Section title
- `contact.description` - Section description
- `contact.contactInfo` - Contact info label
- `contact.sendMessage` - Send message label
- `contact.form.*` - Form field translations
- `contact.map.*` - Map translations

### Footer
- `footer.description` - Footer description
- `footer.quickLinks` - Quick links label
- `footer.ourPrograms` - Our programs label
- `footer.contactInfo` - Contact info label
- `footer.address` - Address label
- `footer.phone` - Phone label
- `footer.email` - Email label
- `footer.copyright` - Copyright text
- `footer.privacy` - Privacy policy link
- `footer.terms` - Terms of service link
- `footer.accessibility` - Accessibility link

### Dashboard
- `dashboard.welcome` - Welcome message
- `dashboard.administrator` - Administrator dashboard label
- `dashboard.search` - Search placeholder
- `dashboard.logout` - Logout button
- `dashboard.profile` - Profile link
- `dashboard.settings` - Settings link

### Authentication
- `auth.signIn` - Sign in button
- `auth.signUp` - Sign up button
- `auth.email` - Email field label
- `auth.password` - Password field label
- `auth.confirmPassword` - Confirm password field label
- `auth.forgotPassword` - Forgot password link
- `auth.rememberMe` - Remember me checkbox
- `auth.noAccount` - No account text
- `auth.haveAccount` - Have account text
- `auth.backToWelcome` - Back to welcome link

### Common
- `common.loading` - Loading text
- `common.redirecting` - Redirecting text
- `common.error` - Error text
- `common.success` - Success text
- `common.cancel` - Cancel button
- `common.save` - Save button
- `common.delete` - Delete button
- `common.edit` - Edit button
- `common.create` - Create button
- `common.update` - Update button
- `common.close` - Close button
- `common.submit` - Submit button
- `common.reset` - Reset button
- `common.back` - Back button
- `common.next` - Next button
- `common.previous` - Previous button
- `common.yes` - Yes text
- `common.no` - No text
- `common.ok` - OK button

## 🔄 Language Switching

The language switcher component automatically:
1. Updates the URL to include the locale prefix
2. Maintains the current page path
3. Provides visual feedback for the current language
4. Supports keyboard navigation

## 🎨 Styling

The language switcher uses the monochromatic blue theme:
- Light theme: Blue backgrounds with dark text
- Dark theme: Dark blue backgrounds with light text
- Hover states and transitions included
- Responsive design for mobile and desktop

## 🚀 Next Steps

1. **Complete Component Translation**: Update all components to use the translation system
2. **Add More Languages**: Extend to support additional languages
3. **SEO Optimization**: Add language-specific meta tags
4. **RTL Support**: Add support for right-to-left languages
5. **Translation Management**: Consider using a translation management system for larger projects

## 📝 Notes

- All translations are type-safe with TypeScript
- Fallback to English if a translation is missing
- URL structure supports SEO-friendly language switching
- Context provider ensures locale is available throughout the app
- Language switcher is accessible and keyboard-friendly
