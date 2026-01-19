"use client";

import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

export function Testimonials() {
    const t = useTranslations("Testimonials");

    const testimonials = [
        {
            id: 1,
            author: "Jan De Smet",
            role: "Project Manager",
            company: "Bouwgroep A",
        },
        {
            id: 2,
            author: "Ivan Petrov",
            role: "Bekister",
            company: "Construct B",
        },
    ];

    return (
        <section className="py-20 bg-neutral-50">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
                        {t("title")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-sm relative">
                            <Quote className="h-8 w-8 text-primary/20 absolute top-6 left-6" />
                            <p className="text-lg text-neutral-600 mb-6 relative z-10 pt-4 italic">
                                "{t(`reviews.${testimonial.id}.text`)}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-neutral-200" />
                                <div>
                                    <p className="font-semibold">{testimonial.author}</p>
                                    <p className="text-sm text-neutral-500">{testimonial.role}, {testimonial.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
