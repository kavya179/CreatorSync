import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Creator from './models/Creator.js';
import Brand from './models/Brand.js';
import Project from './models/Project.js';
import Application from './models/Application.js';
import Workspace from './models/Workspace.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';
import Review from './models/Review.js';
import Payment from './models/Payment.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creatorsync');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Creator.deleteMany();
    await Brand.deleteMany();
    await Project.deleteMany();
    await Application.deleteMany();
    await Workspace.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();
    await Review.deleteMany();
    await Payment.deleteMany();

    console.log('Creating demo users (Brand & Creators)...');

    // 1. Company (Brand) User
    const brandUser = await User.create({
      name: 'Apex Tech Global',
      email: 'brand@creatorsync.com',
      password: 'Password123!',
      role: 'brand',
      profileImage: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200',
      username: 'apextechglobal',
      phone: '+1 (555) 234-5678',
      country: 'United States',
      city: 'San Francisco',
      isVerified: true,
      themePreference: 'dark',
      language: 'en'
    });

    // Brand Profile
    await Brand.create({
      userId: brandUser._id,
      companyName: 'Apex Tech Global',
      industry: 'Technology & Consumer Electronics',
      website: 'https://apextechglobal.example.com',
      description: 'Leading innovator in high-performance wireless audio, smart wearables, and mobile tech accessories.',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
      coverBanner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200',
      phone: '+1 (555) 234-5678',
      country: 'United States',
      city: 'San Francisco',
      address: '500 Howard Street, Suite 400, San Francisco, CA 94105',
      productsServices: 'Pro Wireless ANC Headphones, Smart Audio Glasses, Earbuds Mini, Smartwatch Series 5',
      mission: 'Empowering creators and consumers with cutting-edge immersive audio and smart devices.',
      linkedinUrl: 'https://linkedin.com/company/apextechglobal',
      instagramUrl: 'https://instagram.com/apextechglobal',
      youtubeUrl: 'https://youtube.com/apextechglobal',
      twitterUrl: 'https://twitter.com/apextechglobal',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
      ]
    });

    // 2. Creator 1 User (Sarah Jenkins)
    const creatorUser1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'creator@creatorsync.com',
      password: 'Password123!',
      role: 'creator',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      username: 'sarahjenkinstech',
      phone: '+1 (555) 876-5432',
      country: 'United States',
      city: 'Austin',
      isVerified: true,
      themePreference: 'dark',
      language: 'en'
    });

    // Creator Profile 1
    await Creator.create({
      userId: creatorUser1._id,
      category: 'Tech & Electronics',
      primaryPlatform: 'YouTube',
      experienceYears: 5,
      languages: ['English', 'Spanish'],
      availability: 'Available',
      followersCount: 450000,
      avgEngagement: 5.4,
      avgReach: 185000,
      monthlyViews: 1250000,
      bio: 'Tech reviewer & gadget enthusiast. I test the latest audio gear, smartphones, and smart home tech for an audience of 450,000 tech buyers.',
      portfolioUrl: 'https://sarahjenkinstech.example.com',
      portfolioDescription: 'Dedicated to honest, high-production 4K gadget reviews, unboxing showcases, and long-term product tests.',
      coverBanner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
      youtubeUrl: 'https://youtube.com/c/sarahjenkinstech',
      instagramUrl: 'https://instagram.com/sarah.tech.reviews',
      linkedinUrl: 'https://linkedin.com/in/sarahjenkinstech',
      xUrl: 'https://twitter.com/sarahjenkinsoff',
      niche: ['Tech & Electronics', 'Gadgets', 'Audio Gear', 'Consumer Tech'],
      skills: ['4K Video Editing', 'Unboxing Production', 'Audio Testing', 'Instagram Reels', 'Tech Storytelling'],
      socialChannels: [
        { platform: 'youtube', handle: '@sarahjenkinstech', followers: 450000 },
        { platform: 'instagram', handle: '@sarah.tech.reviews', followers: 280000 },
        { platform: 'tiktok', handle: '@sarahjenkinsoff', followers: 180000 }
      ],
      showcase: [
        {
          title: 'Flagship Headphones ANC Deep Dive Review',
          platform: 'YouTube',
          description: 'Comprehensive 15-minute 4K review testing noise cancellation in urban environments.',
          url: 'https://youtube.com/watch?v=demo_headphones_review',
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
        },
        {
          title: 'Next-Gen Smart Glasses Unboxing Reel',
          platform: 'Instagram',
          description: 'Viral 60-second Reel demonstrating open-ear audio tech.',
          url: 'https://instagram.com/p/demo_smart_glasses',
          thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'
        }
      ],
      experience: [
        {
          companyName: 'Sony Audio Division',
          projectTitle: '1000XM5 Launch Campaign',
          date: new Date('2025-08-15'),
          description: 'Created 1 dedicated YouTube video and 3 Instagram Reels generating 620K views.'
        },
        {
          companyName: 'Bose Consumer Tech',
          projectTitle: 'QuietComfort Ultra Sponsorship',
          date: new Date('2025-11-20'),
          description: 'Integrated product placement with exclusive discount code tracking.'
        }
      ],
      achievements: [
        { title: 'Best Tech Creator Award 2025 - TechCon', date: new Date('2025-10-10') },
        { title: 'Crossed 1M Total YouTube Impressions', date: new Date('2025-12-01') }
      ],
      certificates: [
        { title: 'Certified Digital Content Specialist', issuer: 'YouTube Academy', date: new Date('2024-05-12') }
      ],
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'
      ]
    });

    // 3. Creator 2 User (Alex Rivera)
    const creatorUser2 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@creatorsync.com',
      password: 'Password123!',
      role: 'creator',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      username: 'alexriverafit',
      phone: '+1 (555) 345-6789',
      country: 'United States',
      city: 'Los Angeles',
      isVerified: true,
      themePreference: 'dark',
      language: 'en'
    });

    // Creator Profile 2
    await Creator.create({
      userId: creatorUser2._id,
      category: 'Fitness & Health',
      primaryPlatform: 'Instagram',
      experienceYears: 4,
      languages: ['English'],
      availability: 'Available',
      followersCount: 280000,
      avgEngagement: 4.8,
      avgReach: 120000,
      monthlyViews: 850000,
      bio: 'Fitness coach & active lifestyle creator. Sharing workout routines, sports audio gear reviews, and athletic nutrition.',
      portfolioUrl: 'https://alexriverafit.example.com',
      portfolioDescription: 'High-energy fitness Reels and YouTube shorts targeting active lifestyle enthusiasts.',
      coverBanner: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200',
      instagramUrl: 'https://instagram.com/alexriverafit',
      youtubeUrl: 'https://youtube.com/c/alexriverafitness',
      niche: ['Fitness & Health', 'Sports Gear', 'Active Lifestyle'],
      skills: ['Fitness Content', 'Short Form Reels', 'Workout Demos'],
      socialChannels: [
        { platform: 'instagram', handle: '@alexriverafit', followers: 280000 },
        { platform: 'youtube', handle: '@alexriverafitness', followers: 95000 }
      ]
    });

    console.log('Creating demo Campaigns (Projects)...');

    // Campaign 1: Active Main Campaign
    const project1 = await Project.create({
      brandId: brandUser._id,
      title: 'Apex Pro Wireless Headphones Launch',
      productName: 'Apex Pro ANC Headphones',
      description: 'We are launching our flagship Apex Pro Active Noise Cancelling Wireless Headphones. We need tech & lifestyle creators to showcase unboxing, active noise cancellation in noisy environments, and high-fidelity sound quality.',
      deliverables: [
        '1 Dedicated YouTube Review Video (8-12 mins)',
        '2 Instagram Reels showcasing ANC test',
        '1 Unboxing Story set with link'
      ],
      niche: ['Tech & Electronics', 'Gadgets', 'Audio Gear'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 5000, max: 8000, currency: 'USD' },
      paymentPerCreator: 2500,
      creatorsRequired: 3,
      minFollowers: 50000,
      minEngagementRate: 3.5,
      preferredCreatorCategory: 'Tech & Electronics',
      language: 'English',
      location: 'Global',
      requirements: ['4K resolution video', 'Highlight 40-hour battery life', 'Must include link in bio/description'],
      isRemote: true,
      status: 'active',
      appDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      productImages: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
      ],
      brandGuidelines: 'Maintain an upbeat, premium aesthetic. Focus on ergonomics, sound clarity, ANC isolation, and battery performance.'
    });

    // Campaign 2: Active Secondary Campaign
    const project2 = await Project.create({
      brandId: brandUser._id,
      title: 'Smart Audio Glasses Summer Campaign',
      productName: 'Apex Vision Sound Frames',
      description: 'Summer promotion for open-ear Bluetooth sunglasses. Looking for outdoor, fitness, and tech creators.',
      deliverables: ['1 Short Form Reel/TikTok', '1 Product Integration Video'],
      niche: ['Fitness & Health', 'Tech & Electronics', 'Lifestyle'],
      targetPlatforms: ['Instagram', 'TikTok'],
      budget: { min: 3000, max: 5000, currency: 'USD' },
      paymentPerCreator: 1800,
      creatorsRequired: 2,
      status: 'active',
      location: 'Global'
    });

    // Campaign 3: Completed Campaign
    const project3 = await Project.create({
      brandId: brandUser._id,
      title: 'Ultra Soundbar QX Launch Review',
      productName: 'Apex Soundbar QX',
      description: 'Home theater cinema soundbar campaign featuring room-filling Dolby Atmos technology.',
      deliverables: ['1 Home Theater Setup Video', '1 Instagram Reel'],
      niche: ['Tech & Electronics', 'Home Entertainment'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 4000, max: 6000, currency: 'USD' },
      paymentPerCreator: 3500,
      creatorsRequired: 1,
      status: 'completed',
      location: 'Global'
    });

    // Campaign 4: Draft Campaign
    await Project.create({
      brandId: brandUser._id,
      title: 'Fall Smartwatch Series 5 Brief',
      productName: 'Apex Watch Series 5',
      description: 'Draft sponsorship for upcoming fitness smartwatch launch with AMOLED display & ECG sensors.',
      deliverables: ['1 Full Review Video', '2 Fitness Tracking Reels'],
      niche: ['Tech & Electronics', 'Fitness & Health'],
      targetPlatforms: ['YouTube', 'Instagram'],
      budget: { min: 6000, max: 10000, currency: 'USD' },
      paymentPerCreator: 3000,
      status: 'draft'
    });

    // Campaign 5: Paused Campaign
    await Project.create({
      brandId: brandUser._id,
      title: 'Earbuds Mini Special Edition',
      productName: 'Apex Earbuds Mini',
      description: 'Compact pocket earbuds campaign paused temporarily for inventory restock.',
      deliverables: ['1 Unboxing Video'],
      niche: ['Tech & Electronics'],
      targetPlatforms: ['Instagram'],
      budget: { min: 2000, max: 3500, currency: 'USD' },
      paymentPerCreator: 1500,
      status: 'paused'
    });

    console.log('Creating demo Applications...');

    // Application 1: Sarah -> Project 1 (Approved / Accepted)
    await Application.create({
      projectId: project1._id,
      creatorId: creatorUser1._id,
      pitch: 'I would love to feature the Apex Pro ANC headphones in my upcoming audio gear roundup! My channel reaches 450K tech buyers looking for active noise cancelling headphones.',
      proposedRate: 2500,
      status: 'approved'
    });

    // Application 2: Alex -> Project 1 (Shortlisted)
    await Application.create({
      projectId: project1._id,
      creatorId: creatorUser2._id,
      pitch: 'Hey Apex team! I can showcase your headphones during gym workouts and commuting Reels for an active fitness audience.',
      proposedRate: 2000,
      status: 'shortlisted'
    });

    // Application 3: Alex -> Project 2 (Pending)
    await Application.create({
      projectId: project2._id,
      creatorId: creatorUser2._id,
      pitch: 'Looking forward to demonstrating the vision audio glasses during outdoor running and cycling videos.',
      proposedRate: 1800,
      status: 'pending'
    });

    console.log('Creating demo Collaboration Workspaces...');

    // Workspace 1: Active Collaboration (Sarah & Brand on Project 1)
    const workspace1 = await Workspace.create({
      projectId: project1._id,
      brandId: brandUser._id,
      creatorId: creatorUser1._id,
      agreedRate: 2500,
      status: 'active',
      paymentStatus: 'escrowed',
      milestones: [
        {
          title: 'Script & Concept Approval',
          description: 'Submit video outline and key talking points for brand verification.',
          dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'approved',
          submissionUrl: 'https://docs.google.com/document/d/demo_script_outline',
          submissionNotes: 'Approved script covering noise cancellation benchmarks and 40h battery life test.'
        },
        {
          title: 'Video Draft & Unboxing Proof',
          description: 'Upload unboxing footage and noise isolation demo video for review.',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'submitted',
          submissionUrl: 'https://youtube.com/watch?v=demo_unboxing_apex_draft',
          submissionNotes: 'Full 4K edit draft ready for review. Unboxing sequence starts at 0:45.'
        },
        {
          title: 'Final Publication & Instagram Reels',
          description: 'Publish video live on YouTube and post 2 promotional Instagram Reels with link in bio.',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ]
    });

    // Workspace 2: Completed Collaboration (Sarah & Brand on Project 3)
    await Workspace.create({
      projectId: project3._id,
      brandId: brandUser._id,
      creatorId: creatorUser1._id,
      agreedRate: 3500,
      status: 'completed',
      paymentStatus: 'paid',
      milestones: [
        {
          title: 'Dolby Atmos Home Theater Setup Review',
          description: 'Full video publication and Instagram post.',
          dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: 'approved',
          submissionUrl: 'https://youtube.com/watch?v=demo_soundbar_qx_live',
          submissionNotes: 'Published live! Video received over 120,000 views in the first week.'
        }
      ]
    });

    console.log('Creating demo Messages & Notifications...');

    // Messages between Brand & Sarah on Project 1
    await Message.create({
      projectId: project1._id,
      senderId: brandUser._id,
      receiverId: creatorUser1._id,
      text: 'Hi Sarah! We are thrilled to partner with you on the Apex Pro Wireless Headphones launch campaign!',
      read: true
    });

    await Message.create({
      projectId: project1._id,
      senderId: creatorUser1._id,
      receiverId: brandUser._id,
      text: 'Thanks so much! I received the review sample box yesterday. The premium packaging and build quality look incredible.',
      read: true
    });

    await Message.create({
      projectId: project1._id,
      senderId: creatorUser1._id,
      receiverId: brandUser._id,
      text: "I've uploaded the draft video link for Milestone 2 in our collaboration workspace. Let me know what you think!",
      attachments: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      read: false
    });

    // Notifications for Brand
    await Notification.create({
      recipientId: brandUser._id,
      senderId: creatorUser1._id,
      projectId: project1._id,
      type: 'new_application',
      title: 'New Application Received 📥',
      body: 'Creator "Sarah Jenkins" submitted an application for campaign "Apex Pro Wireless Headphones Launch".',
      link: '/dashboard?tab=applications',
      isRead: true
    });

    await Notification.create({
      recipientId: brandUser._id,
      senderId: creatorUser1._id,
      projectId: project1._id,
      type: 'submission_uploaded',
      title: 'Submission Uploaded 📤',
      body: 'Creator "Sarah Jenkins" uploaded deliverable proof for milestone: "Video Draft & Unboxing Proof" in campaign "Apex Pro Wireless Headphones Launch".',
      link: '/dashboard?tab=collaborations',
      isRead: false
    });

    // Notifications for Creator
    await Notification.create({
      recipientId: creatorUser1._id,
      senderId: brandUser._id,
      projectId: project1._id,
      type: 'application_status',
      title: 'Campaign Application Accepted! 🎉',
      body: 'Your sponsorship application for "Apex Pro Wireless Headphones Launch" has been accepted.',
      link: '/dashboard?tab=applications',
      isRead: true
    });

    await Notification.create({
      recipientId: creatorUser1._id,
      senderId: brandUser._id,
      projectId: project3._id,
      type: 'payment_completed',
      title: 'Payment Released! 💰',
      body: 'Brand marked payment of $3,500 as PAID for campaign "Ultra Soundbar QX Launch Review".',
      link: '/dashboard?tab=completed-collaborations',
      isRead: true
    });

    console.log('Creating demo Reviews & Payments...');

    // Review 1: Brand -> Sarah
    await Review.create({
      projectId: project3._id,
      reviewerId: brandUser._id,
      revieweeId: creatorUser1._id,
      rating: 5,
      comment: 'Sarah delivered top-tier 4K content on time. Her audience engagement resulted in excellent product sales conversion!'
    });

    // Review 2: Sarah -> Brand
    await Review.create({
      projectId: project3._id,
      reviewerId: creatorUser1._id,
      revieweeId: brandUser._id,
      rating: 5,
      comment: 'Working with Apex Tech Global was a pleasure! Clear brand guidelines and instant payout release upon milestone completion.'
    });

    // Payments
    await Payment.create({
      projectId: project3._id,
      creatorId: creatorUser1._id,
      brandId: brandUser._id,
      amount: 3500,
      status: 'released',
      transactionReference: `PAY-COMP-${Date.now()}`
    });

    await Payment.create({
      projectId: project1._id,
      creatorId: creatorUser1._id,
      brandId: brandUser._id,
      amount: 2500,
      status: 'escrowed',
      transactionReference: `PAY-ESCROW-${Date.now()}`
    });

    console.log('\n======================================================');
    console.log('SUCCESS! Demo Database Seeded with Full Features Data');
    console.log('======================================================');
    console.log('Use the following login credentials to test all features:');
    console.log('\n🏢 COMPANY (BRAND) ACCOUNT:');
    console.log('   Email:    brand@creatorsync.com');
    console.log('   Password: Password123!');
    console.log('\n👤 CREATOR ACCOUNT:');
    console.log('   Email:    creator@creatorsync.com');
    console.log('   Password: Password123!');
    console.log('\n👤 SECOND CREATOR ACCOUNT:');
    console.log('   Email:    alex@creatorsync.com');
    console.log('   Password: Password123!');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error with Seeder Data Import:', error);
    process.exit(1);
  }
};

importData();
