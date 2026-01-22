import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/layout/PageHeader';
import { Services } from '@/components/sections/Services';
import { TrustSignals } from '@/components/sections/TrustSignals';
import { Testimonials } from '@/components/sections/Testimonials';
import { EmployerForm } from '@/components/forms/EmployerForm';

export default function EmployersPage() {
    const t = useTranslations('EmployersPage');

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />
            <EmployerForm />
            <Services />
            <TrustSignals />
            <Testimonials />
        </div>
    );
}
