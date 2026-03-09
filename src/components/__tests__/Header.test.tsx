import { render, screen } from '@testing-library/react'
import Header from '../layout/Header'
import { LanguageProvider } from '../../contexts/LanguageContext'

// Mock the LanguageContext
const mockLanguageContext = {
  language: 'en',
  setLanguage: jest.fn(),
  t: (key: string) => {
    const translations: { [key: string]: string } = {
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.alerts': 'Alerts',
      'nav.children': 'Children',
      'nav.settings': 'Settings',
    }
    return translations[key] || key
  },
}

jest.mock('../../contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useLanguage: () => mockLanguageContext,
}))

describe('Header Component', () => {
  it('renders the Guardian Shield title', () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    )
    expect(screen.getByText('Guardian Shield')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Alerts')).toBeInTheDocument()
    expect(screen.getByText('Children')).toBeInTheDocument()
  })
})
