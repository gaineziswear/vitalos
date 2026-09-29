// ─────────────────────────────────────────────────────────────────────────────
// MauriServ i18n — bilingual EN / FR
// ─────────────────────────────────────────────────────────────────────────────

export type Lang = 'en' | 'fr'

export const translations = {
  en: {
    // ── Nav ──
    nav: {
      services:   'Services',
      howItWorks: 'How It Works',
      forPros:    'For Professionals',
      about:      'About',
      signIn:     'Sign In',
      getStarted: 'Get Started',
    },
    // ── Hero ──
    hero: {
      badge:       'Mauritius\'s trusted home services platform',
      headline:    'Get It Done.',
      sub:         'Connect with verified, trusted professionals across Mauritius — from plumbing and electrical to cleaning and gardening.',
      cta:         'Find a Service',
      ctaPro:      'I\'m a Professional',
      trustLine:   'Verified professionals · Secure payments · Real reviews',
    },
    // ── Services ──
    services: {
      heading:    'Every home service, one platform.',
      sub:        'Browse by category or describe your job and we\'ll match you with the right professional.',
      viewAll:    'View All Services',
    },
    // ── How It Works ──
    how: {
      heading:    'Simple. Fast. Reliable.',
      sub:        'Book a trusted professional in minutes.',
      step1Title: 'Describe Your Job',
      step1Body:  'Tell us what you need — add photos, video, your location, and preferred timing.',
      step2Title: 'We Match You',
      step2Body:  'MauriServ finds the best available, verified professionals near you.',
      step3Title: 'Book & Pay',
      step3Body:  'Choose your provider, confirm the booking, and pay securely through the platform.',
      step4Title: 'Job Done',
      step4Body:  'Your professional arrives, completes the work, and you confirm. Simple.',
    },
    // ── Trust ──
    trust: {
      heading:    'Why households trust MauriServ.',
      card1Title: 'Verified Professionals',
      card1Body:  'Every provider is background-checked, reviewed, and carries a visible verification badge.',
      card2Title: 'Secure Payments',
      card2Body:  'Funds are held securely. Providers are only paid after you confirm the work is done.',
      card3Title: 'Real Reviews',
      card3Body:  'Only customers who completed a job can leave a review — no fake ratings.',
      card4Title: 'Local Support',
      card4Body:  'Based in Mauritius. Our team speaks English, French, and Kreol.',
    },
    // ── Testimonials ──
    testimonials: {
      heading: 'What Mauritians are saying.',
      items: [
        {
          name:   'Priya Ramsamy',
          area:   'Quatre Bornes',
          text:   'My air conditioning broke on a Friday evening. MauriServ matched me with a technician the same night. Incredible service.',
          service:'Air Conditioning',
          rating: 5,
        },
        {
          name:   'Jean-Marc Labat',
          area:   'Grand Baie',
          text:   'Used MauriServ for a full bathroom renovation. The whole experience — from request to payment — was completely stress-free.',
          service: 'Plumbing & Tiling',
          rating: 5,
        },
        {
          name:   'Anisha Goburdhun',
          area:   'Curepipe',
          text:   'I manage three rental properties. Having all my maintenance in one place is a game changer. I recommend MauriServ to every landlord.',
          service: 'Property Maintenance',
          rating: 5,
        },
      ],
    },
    // ── For Pros ──
    pros: {
      badge:      'Launch Partner Programme',
      heading:    'Grow your business with MauriServ.',
      sub:        'Join Mauritius\'s first professional home services marketplace. Verified providers during our launch period receive 3 months of free promotional advertising.',
      cta:        'Apply as a Professional',
      pill1:      '3 months free advertising',
      pill2:      'Verification badge',
      pill3:      'Direct bookings',
      pill4:      'Secure payouts',
      disclaimer: 'Free advertising is subject to successful verification. Eligibility conditions apply. No guarantee of bookings. Campaign duration subject to change.',
    },
    // ── Referral ──
    referral: {
      heading: 'Refer a friend. Both of you win.',
      sub:     'Every time a friend books their first service through your unique link, you both receive a reward.',
      cta:     'Get Your Referral Link',
    },
    // ── Stats ──
    stats: {
      s1: '50+ Service Categories',
      s2: 'Verified Professionals',
      s3: 'Mauritius Coverage',
      s4: 'Languages Supported',
      v1: '50+',
      v2: '100+',
      v3: 'Island-wide',
      v4: 'EN · FR · KR',
    },
    // ── FAQ ──
    faq: {
      heading: 'Frequently asked questions.',
      items: [
        {
          q: 'How does MauriServ verify professionals?',
          a: 'We review identity documents, qualifications, licences where applicable, and past work. Only providers who pass our review carry the Verified badge.',
        },
        {
          q: 'How does payment work?',
          a: 'You pay through the platform when confirming a booking. Funds are held securely until you confirm the job is complete. The provider is then paid directly.',
        },
        {
          q: 'What if I\'m not happy with the work?',
          a: 'Raise a dispute through the app within 48 hours. Our team will review the case, mediate, and issue a refund where appropriate.',
        },
        {
          q: 'Can I book for someone else — like my parents?',
          a: 'Yes. You can add multiple properties to your account — your home, a rental, or a family property — and book services for any of them.',
        },
        {
          q: 'How quickly can I get a professional?',
          a: 'For emergency requests, we aim to match within the hour. Scheduled bookings can typically be confirmed within 24 hours depending on availability.',
        },
        {
          q: 'Is MauriServ available across all of Mauritius?',
          a: 'We are launching island-wide. Some remote areas may have limited provider availability initially. Coverage will expand as more professionals join.',
        },
      ],
    },
    // ── Footer ──
    footer: {
      tagline:   'Get It Done.',
      sub:       'Mauritius\'s home services marketplace.',
      services:  'Services',
      company:   'Company',
      legal:     'Legal',
      support:   'Support',
      allRights: 'All rights reserved.',
      links: {
        services: ['Plumbing', 'Electrical', 'Cleaning', 'Gardening', 'Air Conditioning', 'Handyman', 'View All'],
        company:  ['About MauriServ', 'For Professionals', 'Careers', 'Press', 'Contact'],
        legal:    ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'],
        support:  ['Help Centre', 'Raise a Dispute', 'Contact Support', 'WhatsApp Support'],
      },
    },
    // ── Launch offer ──
    launch: {
      badge:    'Launch Offer',
      heading:  'First booking? We\'ve got you.',
      sub:      'Use code MAURISERV10 for 10% off your first service booking. Limited time.',
      cta:      'Claim Offer',
    },
  },

  // ════════════════════════════════════════════
  fr: {
    nav: {
      services:   'Services',
      howItWorks: 'Comment ça marche',
      forPros:    'Pour les pros',
      about:      'À propos',
      signIn:     'Connexion',
      getStarted: 'Commencer',
    },
    hero: {
      badge:       'La plateforme de services à domicile de confiance à Maurice',
      headline:    'C\'est fait.',
      sub:         'Connectez-vous avec des professionnels vérifiés et fiables à travers Maurice — plomberie, électricité, nettoyage, jardinage et bien plus.',
      cta:         'Trouver un service',
      ctaPro:      'Je suis un professionnel',
      trustLine:   'Professionnels vérifiés · Paiements sécurisés · Avis réels',
    },
    services: {
      heading:    'Tous les services à domicile, une seule plateforme.',
      sub:        'Parcourez par catégorie ou décrivez votre besoin — nous vous trouvons le bon professionnel.',
      viewAll:    'Voir tous les services',
    },
    how: {
      heading:    'Simple. Rapide. Fiable.',
      sub:        'Réservez un professionnel de confiance en quelques minutes.',
      step1Title: 'Décrivez votre besoin',
      step1Body:  'Expliquez ce qu\'il vous faut — ajoutez des photos, une vidéo, votre adresse et vos disponibilités.',
      step2Title: 'Nous vous trouvons la perle',
      step2Body:  'MauriServ sélectionne les meilleurs professionnels vérifiés proches de chez vous.',
      step3Title: 'Réservez et payez',
      step3Body:  'Choisissez votre prestataire, confirmez la réservation et payez en toute sécurité.',
      step4Title: 'Mission accomplie',
      step4Body:  'Le professionnel intervient, effectue le travail et vous confirmez. Simple.',
    },
    trust: {
      heading:    'Pourquoi les foyers mauriciens font confiance à MauriServ.',
      card1Title: 'Professionnels vérifiés',
      card1Body:  'Chaque prestataire est vérifié, évalué et affiche un badge de vérification visible.',
      card2Title: 'Paiements sécurisés',
      card2Body:  'Les fonds sont sécurisés. Le prestataire n\'est payé qu\'après confirmation du travail.',
      card3Title: 'Avis authentiques',
      card3Body:  'Seuls les clients ayant effectué une réservation peuvent laisser un avis.',
      card4Title: 'Support local',
      card4Body:  'Basé à Maurice. Notre équipe parle anglais, français et kreol.',
    },
    testimonials: {
      heading: 'Ce que disent les Mauriciens.',
      items: [
        {
          name:    'Priya Ramsamy',
          area:    'Quatre Bornes',
          text:    'Ma climatisation est tombée en panne un vendredi soir. MauriServ m\'a trouvé un technicien le soir même. Service incroyable.',
          service: 'Climatisation',
          rating:  5,
        },
        {
          name:    'Jean-Marc Labat',
          area:    'Grand Baie',
          text:    'J\'ai utilisé MauriServ pour une rénovation complète de salle de bain. Toute l\'expérience — de la demande au paiement — était sans stress.',
          service: 'Plomberie & Carrelage',
          rating:  5,
        },
        {
          name:    'Anisha Goburdhun',
          area:    'Curepipe',
          text:    'Je gère trois propriétés locatives. Centraliser toute la maintenance en un seul endroit change tout. Je recommande MauriServ à tous les propriétaires.',
          service: 'Entretien immobilier',
          rating:  5,
        },
      ],
    },
    pros: {
      badge:      'Programme Partenaire de Lancement',
      heading:    'Développez votre activité avec MauriServ.',
      sub:        'Rejoignez la première place de marché de services à domicile à Maurice. Les prestataires vérifiés pendant notre période de lancement bénéficient de 3 mois de publicité promotionnelle gratuite.',
      cta:        'Candidater en tant que professionnel',
      pill1:      '3 mois de pub gratuite',
      pill2:      'Badge de vérification',
      pill3:      'Réservations directes',
      pill4:      'Paiements sécurisés',
      disclaimer: 'La publicité gratuite est soumise à une vérification réussie. Conditions d\'éligibilité applicables. Aucune garantie de réservations. Durée de campagne susceptible de modification.',
    },
    referral: {
      heading: 'Parrainez un ami. Vous gagnez tous les deux.',
      sub:     'Chaque fois qu\'un ami réserve son premier service via votre lien unique, vous recevez tous les deux une récompense.',
      cta:     'Obtenir mon lien de parrainage',
    },
    stats: {
      s1: '+50 catégories de services',
      s2: 'Professionnels vérifiés',
      s3: 'Couverture à Maurice',
      s4: 'Langues supportées',
      v1: '50+',
      v2: '100+',
      v3: 'Île entière',
      v4: 'EN · FR · KR',
    },
    faq: {
      heading: 'Questions fréquentes.',
      items: [
        {
          q: 'Comment MauriServ vérifie-t-il les professionnels ?',
          a: 'Nous vérifions les pièces d\'identité, les qualifications, les licences le cas échéant, et les travaux antérieurs. Seuls les prestataires ayant passé notre vérification obtiennent le badge Vérifié.',
        },
        {
          q: 'Comment fonctionne le paiement ?',
          a: 'Vous payez via la plateforme lors de la confirmation de réservation. Les fonds sont conservés en toute sécurité jusqu\'à votre confirmation. Le prestataire est ensuite payé directement.',
        },
        {
          q: 'Que faire si je ne suis pas satisfait du travail ?',
          a: 'Signalez un litige dans l\'application dans les 48 heures. Notre équipe examinera le dossier, servira de médiateur et remboursera si nécessaire.',
        },
        {
          q: 'Puis-je réserver pour quelqu\'un d\'autre — mes parents par exemple ?',
          a: 'Oui. Vous pouvez ajouter plusieurs propriétés à votre compte — votre domicile, un bien locatif ou une propriété familiale — et réserver des services pour chacune.',
        },
        {
          q: 'Quel est le délai d\'intervention ?',
          a: 'Pour les urgences, nous visons une mise en relation dans l\'heure. Les réservations planifiées sont généralement confirmées sous 24 heures selon les disponibilités.',
        },
        {
          q: 'MauriServ est-il disponible sur toute l\'île ?',
          a: 'Nous lançons à l\'échelle de l\'île. Certaines zones isolées peuvent avoir une disponibilité limitée dans un premier temps. La couverture s\'étendra au fur et à mesure.',
        },
      ],
    },
    footer: {
      tagline:   'C\'est fait.',
      sub:       'La place de marché de services à domicile à Maurice.',
      services:  'Services',
      company:   'Société',
      legal:     'Mentions légales',
      support:   'Support',
      allRights: 'Tous droits réservés.',
      links: {
        services: ['Plomberie', 'Électricité', 'Nettoyage', 'Jardinage', 'Climatisation', 'Bricolage', 'Voir tout'],
        company:  ['À propos de MauriServ', 'Pour les professionnels', 'Recrutement', 'Presse', 'Contact'],
        legal:    ['Conditions d\'utilisation', 'Politique de confidentialité', 'Cookies', 'Politique de remboursement'],
        support:  ['Centre d\'aide', 'Signaler un litige', 'Contacter le support', 'Support WhatsApp'],
      },
    },
    launch: {
      badge:    'Offre de lancement',
      heading:  'Première réservation ? On s\'en occupe.',
      sub:      'Utilisez le code MAURISERV10 pour 10% de réduction sur votre première réservation. Durée limitée.',
      cta:      'Profiter de l\'offre',
    },
  },
} as const

export type Translations = typeof translations.en
export type T = Translations
