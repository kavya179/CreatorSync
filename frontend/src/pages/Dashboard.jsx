import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  Users,
  FileText,
  DollarSign,
  PlusCircle,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Clock,
  Sparkles,
  Youtube,
  Instagram,
  MessageSquare,
  Bell,
  Trash2,
  Save,
  Check,
  Mail,
  Compass,
  Bookmark,
  Calendar,
  Layers,
  CreditCard,
  Building,
  CheckSquare,
  AlertTriangle,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertOctagon,
  Smile,
  Image,
  Paperclip,
  Send,
  BarChart2,
  Settings as SettingsIcon,
  Lock,
  Globe,
  User as UserCircle,
  Palette,
  Edit as EditIcon,
  Play,
  Pause,
  XCircle,
  Plus
} from 'lucide-react';

// Chart.js Integrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line as LineChart, Bar as BarChart, Doughnut as DoughnutChart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activeProjects: 0, totalApplications: 0, financialMetric: 0 });
  const [applications, setApplications] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [appSubTab, setAppSubTab] = useState('all');
  const [collabSubTab, setCollabSubTab] = useState('all');
  const [notifFilter, setNotifFilter] = useState('all');
  const [changeRequestModal, setChangeRequestModal] = useState(null);
  const [threadSearch, setThreadSearch] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [error, setError] = useState(null);

  // Messaging States
  const [inboxThreads, setInboxThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [attachUrl, setAttachUrl] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [chatSearch, setChatSearch] = useState('');
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [mediaDrawer, setMediaDrawer] = useState(null);
  const [mediaUrlInput, setMediaUrlInput] = useState('');

  // Admin Specific States
  const [adminStats, setAdminStats] = useState({ totalUsers: 0, creatorUsers: 0, brandUsers: 0, totalProjects: 0, activeReports: 0, platformFeeRevenue: 0 });
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminReports, setAdminReports] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRole, setNewRole] = useState('creator');

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [password, setPassword] = useState('');
  
  // Creator Details Form States
  const [creatorBio, setCreatorBio] = useState(user?.creatorDetails?.bio || '');
  const [creatorPortfolio, setCreatorPortfolio] = useState(user?.creatorDetails?.portfolioUrl || '');
  const [nicheInput, setNicheInput] = useState(user?.creatorDetails?.niche?.join(', ') || '');
  
  // Brand Details Form States
  const [companyName, setCompanyName] = useState(user?.brandDetails?.companyName || '');
  const [brandIndustry, setBrandIndustry] = useState(user?.brandDetails?.industry || '');
  const [brandWebsite, setBrandWebsite] = useState(user?.brandDetails?.website || '');
  const [brandDescription, setBrandDescription] = useState(user?.brandDetails?.description || '');
  const [brandInsta, setBrandInsta] = useState('');
  const [brandTwitter, setBrandTwitter] = useState('');
  const [brandLinkedin, setBrandLinkedin] = useState('');
  const [brandFacebook, setBrandFacebook] = useState('');
  const [brandImages, setBrandImages] = useState('');

  // Social Channels States
  const [youtubeHandle, setYoutubeHandle] = useState('');
  const [youtubeFollowers, setYoutubeFollowers] = useState('');
  const [instaHandle, setInstaHandle] = useState('');
  const [instaFollowers, setInstaFollowers] = useState('');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [tiktokFollowers, setTiktokFollowers] = useState('');

  // Project Brief Form states (Brand)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [platformsInput, setPlatformsInput] = useState('');
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [creatorsRequiredInput, setCreatorsRequiredInput] = useState(1);
  const [deadlineInput, setDeadlineInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [isRemoteInput, setIsRemoteInput] = useState(true);

  // Extended campaign management states
  const [productName, setProductName] = useState('');
  const [paymentPerCreator, setPaymentPerCreator] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [minEngagementRate, setMinEngagementRate] = useState('');
  const [preferredCreatorCategory, setPreferredCreatorCategory] = useState('');
  const [campaignLanguage, setCampaignLanguage] = useState('');
  const [appDeadline, setAppDeadline] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [productImages, setProductImages] = useState('');
  const [brandGuidelines, setBrandGuidelines] = useState('');
  const [campaignStatus, setCampaignStatus] = useState('active');
  const [editingCampaignId, setEditingCampaignId] = useState(null);

  // Active Campaign Inspection (For Applications review)
  const [inspectedCampaign, setInspectedCampaign] = useState(null);
  const [campaignApplicants, setCampaignApplicants] = useState([]);

  // Success Feedback triggers
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings State Hooks
  const [lang, setLang] = useState(user?.language || 'en');
  const [profPublic, setProfPublic] = useState(user?.privacySettings?.profilePublic ?? true);
  const [emailAlert, setEmailAlert] = useState(user?.notificationSettings?.emailAlerts ?? true);
  const [inAppAlert, setInAppAlert] = useState(user?.notificationSettings?.inAppAlerts ?? true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Hydrate notifications & messages
      try {
        const notifRes = await api.get('/notifications');
        setNotifications(notifRes.data || []);
        
        const inboxRes = await api.get('/messages/inbox');
        setInboxThreads(inboxRes.data || []);
      } catch (notifErr) {
        console.warn('Notifications/inbox fetch warning:', notifErr.message);
      }
      
      if (user.role === 'admin') {
        const statsRes = await api.get('/admin/stats');
        setAdminStats(statsRes.data);
        fetchAdminUsers();
        const reportsRes = await api.get('/admin/reports');
        setAdminReports(reportsRes.data || []);
        const projRes = await api.get('/campaigns');
        setCampaigns(projRes.data || []);
      } else {
        const wsRes = await api.get('/workspaces');
        const wsList = wsRes.data || [];
        setWorkspaces(wsList);

        if (user.role === 'creator') {
          const appRes = await api.get('/applications/me');
          const appList = appRes.data || [];
          setApplications(appList);

          const campRes = await api.get('/campaigns');
          const campList = campRes.data || [];
          setCampaigns(campList);

          const activeWorkspaces = wsList.filter(w => w.status === 'active');
          const totalEarnings = wsList
            .filter(w => w.status === 'completed')
            .reduce((acc, curr) => acc + (curr.proposedRate || 1500), 0);

          setStats({
            activeProjects: activeWorkspaces.length,
            totalApplications: appList.length,
            financialMetric: totalEarnings || 2450
          });

          if (user.creatorDetails) {
            setCreatorBio(user.creatorDetails.bio || '');
            setCreatorPortfolio(user.creatorDetails.portfolioUrl || '');
            setNicheInput(user.creatorDetails.niche?.join(', ') || '');
            
            const yt = user.creatorDetails.socialChannels?.find(c => c.platform === 'youtube');
            if (yt) {
              setYoutubeHandle(yt.handle || '');
              setYoutubeFollowers(yt.followers || '');
            }
            const inst = user.creatorDetails.socialChannels?.find(c => c.platform === 'instagram');
            if (inst) {
              setInstaHandle(inst.handle || '');
              setInstaFollowers(inst.followers || '');
            }
            const tk = user.creatorDetails.socialChannels?.find(c => c.platform === 'tiktok');
            if (tk) {
              setTiktokHandle(tk.handle || '');
              setTiktokFollowers(tk.followers || '');
            }
          }
        } else {
          const campRes = await api.get('/campaigns/me');
          const campList = campRes.data || [];
          setCampaigns(campList);

          const appRes = await api.get('/applications/brand');
          const appList = appRes.data || [];
          setApplications(appList);

          const activeWorkspaces = wsList.filter(w => w.status === 'active');
          const totalBudget = campList.reduce((acc, curr) => acc + (curr.budget?.max || 0), 0);

          setStats({
            activeProjects: activeWorkspaces.length,
            totalApplications: appList.length,
            financialMetric: totalBudget
          });

          if (user.brandDetails) {
            setCompanyName(user.brandDetails.companyName || '');
            setBrandIndustry(user.brandDetails.industry || '');
            setBrandWebsite(user.brandDetails.website || '');
            setBrandDescription(user.brandDetails.description || '');
            
            const inst = user.brandDetails.socialLinks?.find(s => s.platform === 'instagram');
            setBrandInsta(inst ? inst.handle : '');
            const twit = user.brandDetails.socialLinks?.find(s => s.platform === 'twitter');
            setBrandTwitter(twit ? twit.handle : '');
            const lnkd = user.brandDetails.socialLinks?.find(s => s.platform === 'linkedin');
            setBrandLinkedin(lnkd ? lnkd.handle : '');
            const face = user.brandDetails.socialLinks?.find(s => s.platform === 'facebook');
            setBrandFacebook(face ? face.handle : '');
            setBrandImages(user.brandDetails.images?.join(', ') || '');
          }
        }
      }
    } catch (err) {
      console.warn('Dashboard hydrate warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const usersRes = await api.get(`/admin/users?search=${userSearch}&role=${userRoleFilter}&page=${userPage}`);
      setAdminUsers(usersRes.data.users || []);
      setUserTotalPages(usersRes.data.pages || 1);
    } catch (err) {
      console.warn('Error fetching admin users:', err.message);
    }
  };

  const fetchChatMessages = async (projectId) => {
    try {
      const res = await api.get(`/messages/thread/${projectId}`);
      setChatMessages(res.data || []);
      
      // Mark read seen state
      await api.put(`/messages/thread/${projectId}/read`);
      
      // Reload inbox to update counters
      const inboxRes = await api.get('/messages/inbox');
      setInboxThreads(inboxRes.data || []);
    } catch (err) {
      console.warn('Error fetching chats:', err.message);
    }
  };

  const handleWithdrawApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await api.delete(`/applications/${appId}`);
      
      // Refresh applications lists
      const appRes = await api.get('/applications/me');
      setApplications(appRes.data || []);
      
      // Also refresh dashboard workspaces/stats
      const wsRes = await api.get('/workspaces');
      const wsList = wsRes.data || [];
      setWorkspaces(wsList);
      
      const activeWorkspaces = wsList.filter(w => w.status === 'active');
      const totalEarnings = wsList
        .filter(w => w.status === 'completed')
        .reduce((acc, curr) => acc + (curr.proposedRate || 1500), 0);
      
      setStats({
        activeProjects: activeWorkspaces.length,
        totalApplications: appRes.data.length,
        financialMetric: totalEarnings || 2450
      });
    } catch (err) {
      console.warn('Withdraw application error:', err.message);
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setLoading(false);
    }
  };
  // Active collaborations states
  const [submittingMilestoneId, setSubmittingMilestoneId] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [activeChatWsId, setActiveChatWsId] = useState(null);
  const [typedWsMessage, setTypedWsMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSubmitMilestoneProof = async (wsId, mId) => {
    if (!submissionUrl) return;
    setSubmissionLoading(true);
    try {
      await api.post(`/workspaces/${wsId}/milestones`, {
        milestoneId: mId,
        submissionUrl: submissionUrl,
        submissionNotes: submissionNotes
      });
      // Reload workspaces
      const wsRes = await api.get('/workspaces');
      setWorkspaces(wsRes.data || []);
      setSubmissionUrl('');
      setSubmissionNotes('');
      setSubmittingMilestoneId(null);
      alert('Proof of Work submitted successfully!');
    } catch (err) {
      console.warn('Milestone submission failed:', err.message);
      alert(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmissionLoading(false);
    }
  };

  const handleSendWsMessage = async (wsId) => {
    if (!typedWsMessage.trim()) return;
    setChatLoading(true);
    try {
      await api.post(`/workspaces/${wsId}/messages`, { text: typedWsMessage });
      // Reload workspaces
      const wsRes = await api.get('/workspaces');
      setWorkspaces(wsRes.data || []);
      setTypedWsMessage('');
    } catch (err) {
      console.warn('WS message send failed:', err.message);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Refetch admin users when filters change
  useEffect(() => {
    if (user.role === 'admin') {
      fetchAdminUsers();
    }
  }, [userSearch, userRoleFilter, userPage]);



  const handleCreateOrUpdate = async (e, forcedStatus) => {
    if (e) e.preventDefault();
    setCreating(true);
    setError(null);
    setSaveSuccess(false);
    
    const statusToSave = forcedStatus || campaignStatus;
    
    try {
      const campaignData = {
        title,
        description,
        niche: nicheInput.split(',').map(s => s.trim()).filter(Boolean),
        targetPlatforms: platformsInput.split(',').map(s => s.trim()).filter(Boolean),
        deliverables: deliverablesInput.split(',').map(s => s.trim()).filter(Boolean),
        budget: {
          min: Number(budgetMin),
          max: Number(budgetMax)
        },
        creatorsRequired: Number(creatorsRequiredInput) || 1,
        deadline: deadlineInput || undefined,
        location: locationInput || undefined,
        requirements: requirementsInput ? requirementsInput.split(',').map(s => s.trim()).filter(Boolean) : [],
        isRemote: isRemoteInput,
        status: statusToSave,
        productName,
        paymentPerCreator: Number(paymentPerCreator) || 0,
        minFollowers: Number(minFollowers) || 0,
        minEngagementRate: Number(minEngagementRate) || 0,
        preferredCreatorCategory,
        language: campaignLanguage,
        appDeadline: appDeadline || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        submissionDeadline: submissionDeadline || undefined,
        productImages: productImages ? productImages.split(',').map(s => s.trim()).filter(Boolean) : [],
        brandGuidelines
      };

      if (editingCampaignId) {
        await api.put(`/campaigns/${editingCampaignId}`, campaignData);
      } else {
        await api.post('/campaigns', campaignData);
      }

      // Reset fields
      setTitle('');
      setDescription('');
      setBudgetMin('');
      setBudgetMax('');
      setNicheInput('');
      setPlatformsInput('');
      setDeliverablesInput('');
      setCreatorsRequiredInput(1);
      setDeadlineInput('');
      setLocationInput('');
      setRequirementsInput('');
      setIsRemoteInput(true);
      setProductName('');
      setPaymentPerCreator('');
      setMinFollowers('');
      setMinEngagementRate('');
      setPreferredCreatorCategory('');
      setCampaignLanguage('');
      setAppDeadline('');
      setStartDate('');
      setEndDate('');
      setSubmissionDeadline('');
      setProductImages('');
      setBrandGuidelines('');
      setCampaignStatus('active');
      setEditingCampaignId(null);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process campaign brief.');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    await handleCreateOrUpdate(e);
  };

  const handleUpdateStatusOnly = async (campaignId, newStatus) => {
    try {
      await api.put(`/campaigns/${campaignId}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to update campaign status:', err.message);
      setError('Failed to update status.');
    }
  };

  const handleDeleteCampaignOnly = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await api.delete(`/campaigns/${campaignId}`);
      // If the deleted campaign was currently being inspected, clear it
      if (inspectedCampaign?._id === campaignId) {
        setInspectedCampaign(null);
        setCampaignApplicants([]);
      }
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to delete campaign:', err.message);
      setError('Failed to delete campaign.');
    }
  };

  const handleStartEditCampaign = (camp) => {
    setEditingCampaignId(camp._id);
    setTitle(camp.title || '');
    setDescription(camp.description || '');
    setBudgetMin(camp.budget?.min || '');
    setBudgetMax(camp.budget?.max || '');
    setNicheInput(camp.niche ? camp.niche.join(', ') : '');
    setPlatformsInput(camp.targetPlatforms ? camp.targetPlatforms.join(', ') : '');
    setDeliverablesInput(camp.deliverables ? camp.deliverables.join(', ') : '');
    setCreatorsRequiredInput(camp.creatorsRequired || 1);
    setDeadlineInput(camp.deadline ? camp.deadline.substring(0, 10) : '');
    setLocationInput(camp.location || '');
    setRequirementsInput(camp.requirements ? camp.requirements.join(', ') : '');
    setIsRemoteInput(camp.isRemote ?? true);
    setProductName(camp.productName || '');
    setPaymentPerCreator(camp.paymentPerCreator || '');
    setMinFollowers(camp.minFollowers || '');
    setMinEngagementRate(camp.minEngagementRate || '');
    setPreferredCreatorCategory(camp.preferredCreatorCategory || '');
    setCampaignLanguage(camp.language || '');
    setAppDeadline(camp.appDeadline ? camp.appDeadline.substring(0, 10) : '');
    setStartDate(camp.startDate ? camp.startDate.substring(0, 10) : '');
    setEndDate(camp.endDate ? camp.endDate.substring(0, 10) : '');
    setSubmissionDeadline(camp.submissionDeadline ? camp.submissionDeadline.substring(0, 10) : '');
    setProductImages(camp.productImages ? camp.productImages.join(', ') : '');
    setBrandGuidelines(camp.brandGuidelines || '');
    setCampaignStatus(camp.status || 'active');

    // Switch view parameter to 'create' brief page
    setSearchParams({ tab: 'create' });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setError(null);
    try {
      let profileData = {
        name: profileName,
        profileImage
      };

      if (user.role === 'creator') {
        const socialChannels = [];
        if (youtubeHandle) {
          socialChannels.push({ platform: 'youtube', handle: youtubeHandle, followers: Number(youtubeFollowers) || 0 });
        }
        if (instaHandle) {
          socialChannels.push({ platform: 'instagram', handle: instaHandle, followers: Number(instaFollowers) || 0 });
        }
        if (tiktokHandle) {
          socialChannels.push({ platform: 'tiktok', handle: tiktokHandle, followers: Number(tiktokFollowers) || 0 });
        }
        profileData.creatorDetails = {
          bio: creatorBio,
          portfolioUrl: creatorPortfolio,
          niche: nicheInput.split(',').map(s => s.trim()).filter(Boolean),
          socialChannels
        };
      } else if (user.role === 'brand') {
        const socialLinks = [];
        if (brandInsta) socialLinks.push({ platform: 'instagram', handle: brandInsta });
        if (brandTwitter) socialLinks.push({ platform: 'twitter', handle: brandTwitter });
        if (brandLinkedin) socialLinks.push({ platform: 'linkedin', handle: brandLinkedin });
        if (brandFacebook) socialLinks.push({ platform: 'facebook', handle: brandFacebook });

        profileData.brandDetails = {
          companyName,
          industry: brandIndustry,
          website: brandWebsite,
          description: brandDescription,
          socialLinks,
          images: brandImages.split(',').map(s => s.trim()).filter(Boolean)
        };
      }

      if (password) {
        profileData.password = password;
      }

      await updateProfile(profileData);
      setSaveSuccess(true);
      setPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setError(null);
    try {
      const payload = {
        name: profileName,
        profileImage,
        language: lang,
        themePreference: theme,
        privacySettings: { profilePublic: profPublic },
        notificationSettings: { emailAlerts: emailAlert, inAppAlerts: inAppAlert }
      };

      if (user.role === 'creator') {
        const socialChannels = [];
        if (youtubeHandle) {
          socialChannels.push({ platform: 'youtube', handle: youtubeHandle, followers: Number(youtubeFollowers) || 0 });
        }
        if (instaHandle) {
          socialChannels.push({ platform: 'instagram', handle: instaHandle, followers: Number(instaFollowers) || 0 });
        }
        if (tiktokHandle) {
          socialChannels.push({ platform: 'tiktok', handle: tiktokHandle, followers: Number(tiktokFollowers) || 0 });
        }
        payload.creatorDetails = {
          bio: creatorBio,
          portfolioUrl: creatorPortfolio,
          niche: nicheInput ? nicheInput.split(',').map(s => s.trim()).filter(Boolean) : [],
          socialChannels
        };
      }

      if (password) {
        payload.password = password;
      }

      await updateProfile(payload);
      setSaveSuccess(true);
      setPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    }
  };

  const handleDeleteAccount = async () => {
    const doubleCheck = window.confirm('WARNING: Deleting your account will suspend your campaigns, erase your settings profiles, and delete all workspaces records. Proceed?');
    if (!doubleCheck) return;

    try {
      await api.delete('/users/profile');
      logout();
    } catch (err) {
      console.warn('Failed to delete account:', err.message);
    }
  };

  const inspectCampaignApplicants = async (camp) => {
    try {
      setInspectedCampaign(camp);
      const res = await api.get(`/campaigns/${camp._id}/applications`);
      setCampaignApplicants(res.data || []);
    } catch (err) {
      console.warn('Error fetching applicants:', err.message);
    }
  };

  const handleApplicationStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      if (inspectedCampaign) {
        inspectCampaignApplicants(inspectedCampaign);
      }
      fetchDashboardData();
    } catch (err) {
      console.warn('Error updating application status:', err.message);
    }
  };

  const handleStartMessagingCreator = async (creatorId, projectId, creatorName) => {
    try {
      await api.post(`/messages/thread/${projectId}`, {
        text: `Hi ${creatorName}! Let's chat about your pitch proposal for this campaign.`,
        receiverId: creatorId
      });
      const inboxRes = await api.get('/messages/inbox');
      const updatedThreads = inboxRes.data || [];
      setInboxThreads(updatedThreads);
      const matchingThread = updatedThreads.find(t => t.projectId === projectId && t.partnerId === creatorId);
      if (matchingThread) {
        selectThread(matchingThread);
      }
      setSearchParams({ tab: 'messages' });
    } catch (err) {
      console.warn('Failed to start chat thread:', err.message);
      setError('Failed to open message thread.');
    }
  };

  const handleInviteToAnotherCampaign = async (creatorId, targetCampaignId, campaignTitle) => {
    try {
      await api.post(`/campaigns/${targetCampaignId}/invite`, { creatorId });
      alert(`Invitation sent successfully to creator for: "${campaignTitle}"`);
    } catch (err) {
      console.warn('Failed to invite creator to campaign:', err.message);
      setError('Failed to send campaign invitation.');
    }
  };

  const handleApproveSubmission = async (wsId, mId) => {
    try {
      await api.patch(`/workspaces/${wsId}/milestones/${mId}/approve`);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to approve deliverable submission:', err.message);
    }
  };

  const handleRequestChanges = async (wsId, mId, feedbackNotes) => {
    try {
      await api.patch(`/workspaces/${wsId}/milestones/${mId}/request-changes`, { feedbackNotes });
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to request changes:', err.message);
    }
  };

  const handleMarkWorkspaceCompleted = async (wsId) => {
    try {
      await api.patch(`/workspaces/${wsId}/complete`);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to mark workspace completed:', err.message);
    }
  };

  const handleMarkPaymentPaid = async (wsId) => {
    try {
      await api.patch(`/workspaces/${wsId}/pay`);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to mark payment paid:', err.message);
    }
  };

  const calculateMatchScore = (campaign, profile) => {
    if (!campaign || !profile) return 75;
    let score = 50;
    if (campaign.niche && profile.niche) {
      const commonNiches = campaign.niche.filter(n => 
        profile.niche.some(pn => pn.toLowerCase().trim() === n.toLowerCase().trim())
      );
      if (commonNiches.length > 0) score += 20;
    }
    if (campaign.targetPlatforms && (profile.primaryPlatform || profile.socialChannels)) {
      const platforms = campaign.targetPlatforms.map(p => p.toLowerCase().trim());
      const primary = profile.primaryPlatform?.toLowerCase().trim();
      const hasPlatform = platforms.includes(primary) || 
        profile.socialChannels?.some(sc => platforms.includes(sc.platform.toLowerCase().trim()));
      if (hasPlatform) score += 20;
    }
    if (campaign.minFollowers && profile.followersCount) {
      if (profile.followersCount >= campaign.minFollowers) {
        score += 10;
      } else {
        score += Math.round((profile.followersCount / campaign.minFollowers) * 10);
      }
    }
    return Math.min(score, 100);
  };

  // NOTIFICATION UTILS
  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      const notifRes = await api.get('/notifications');
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.warn('Failed to mark read:', err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      const notifRes = await api.get('/notifications');
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.warn('Failed to mark all read:', err.message);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      const notifRes = await api.get('/notifications');
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.warn('Failed to delete notification:', err.message);
    }
  };

  // CHAT ACTIONS
  const selectThread = (thread) => {
    setActiveThread(thread);
    fetchChatMessages(thread.projectId);
    setMobileShowChat(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeThread) return;
    if (!typedMessage && !attachUrl) return;

    try {
      const msgBody = {
        text: typedMessage,
        receiverId: activeThread.partnerId,
        attachments: attachUrl ? [attachUrl] : []
      };

      await api.post(`/messages/thread/${activeThread.projectId}`, msgBody);
      setTypedMessage('');
      setAttachUrl('');
      fetchChatMessages(activeThread.projectId);
    } catch (err) {
      console.warn('Message send failed:', err.message);
    }
  };

  const handleAppendEmoji = (emoji) => {
    setTypedMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleUserInputChange = (e) => {
    setTypedMessage(e.target.value);
    // Simulate typing indicator trigger
    if (!partnerTyping) {
      setPartnerTyping(true);
      setTimeout(() => setPartnerTyping(false), 2000);
    }
  };

  // ADMIN OPERATIONS
  const handleUpdateUserRole = async (e) => {
    e.preventDefault();
    if (!selectedUserForRole) return;
    try {
      await api.put(`/admin/users/${selectedUserForRole._id}/role`, { role: newRole });
      setSelectedUserForRole(null);
      fetchAdminUsers();
      fetchDashboardData();
    } catch (err) {
      console.warn('Error updating user role:', err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend and delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchAdminUsers();
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleDeleteProject = async (projId) => {
    if (!window.confirm('Are you sure you want to delete this campaign brief for moderation?')) return;
    try {
      await api.delete(`/admin/projects/${projId}`);
      const projRes = await api.get('/campaigns');
      setCampaigns(projRes.data || []);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to moderate project:', err.message);
    }
  };

  const handleUpdateReportStatus = async (repId, status) => {
    try {
      await api.put(`/admin/reports/${repId}`, { status });
      const reportsRes = await api.get('/admin/reports');
      setAdminReports(reportsRes.data || []);
      fetchDashboardData();
    } catch (err) {
      console.warn('Failed to resolve report:', err.message);
    }
  };

  // SETTINGS PANEL UI RENDERER
  const renderSettingsLayout = () => {
    return (
      <form onSubmit={handleSaveSettings} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '850px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={22} style={{ color: 'var(--primary)' }} />
          Account settings & Profile configuration
        </h3>

        {saveSuccess && (
          <div style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>Settings and preferences successfully updated!</span>
          </div>
        )}

        <div className="row g-4 mb-4">
          {/* Edit Profile */}
          <div className="col-12 col-md-6">
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> Edit Profile</h4>
            <div className="form-group mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required style={{ marginBottom: 0 }} />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Profile Avatar Image Link</label>
              <input type="text" className="form-input" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://example.com/avatar.jpg" style={{ marginBottom: 0 }} />
            </div>
          </div>

          {/* Preferences & Dark Mode */}
          <div className="col-12 col-md-6">
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Palette size={16} /> Theme & Preferences</h4>
            <div className="form-group mb-3">
              <label className="form-label">System Language</label>
              <select className="form-select form-input" value={lang} onChange={(e) => setLang(e.target.value)} style={{ marginBottom: 0 }}>
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Dark Mode Preference</label>
              <select className="form-select form-input" value={theme} onChange={(e) => setTheme(e.target.value)} style={{ marginBottom: 0 }}>
                <option value="light">Light Theme Mode</option>
                <option value="dark">Dark Theme Mode (Recommended)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Change Password & Privacy & Notifications Row */}
        <div className="row g-4 mb-4 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>
          {/* Change Password */}
          <div className="col-12 col-md-6">
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={16} /> Change Password</h4>
            <div className="form-group mb-3">
              <label className="form-label">New Password (leave blank to preserve)</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password (Min 6 chars)" style={{ marginBottom: 0 }} />
            </div>
          </div>

          {/* Notification & Privacy Settings */}
          <div className="col-12 col-md-6">
            <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={16} /> Privacy & Notification Preferences</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={profPublic} onChange={(e) => setProfPublic(e.target.checked)} />
                Public Creator Profile Visibility
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={emailAlert} onChange={(e) => setEmailAlert(e.target.checked)} />
                Receive Email Notifications Alerts
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={inAppAlert} onChange={(e) => setInAppAlert(e.target.checked)} />
                Receive In-App System Alerts
              </label>
            </div>
          </div>
        </div>

        {/* Connected Social Accounts Section (Only visible for Creators) */}
        {user.role === 'creator' && (
          <div className="row g-4 mb-4 border-top pt-4" style={{ borderColor: 'var(--border-color)' }}>
            <div className="col-12">
              <h4 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={16} /> Connected Social Accounts</h4>
              
              <div className="row g-3">
                {/* YouTube */}
                <div className="col-12 col-md-4">
                  <div className="p-3 glass-panel" style={{ background: 'var(--bg-tertiary)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger)' }}>YOUTUBE</span>
                    <div className="form-group mt-2 mb-2">
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Channel Handle</label>
                      <input type="text" className="form-input" value={youtubeHandle} onChange={(e) => setYoutubeHandle(e.target.value)} placeholder="@handle" style={{ fontSize: '0.78rem', padding: '6px 10px', marginBottom: 0 }} />
                    </div>
                    <div className="form-group mb-0">
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Followers Count</label>
                      <input type="number" className="form-input" value={youtubeFollowers} onChange={(e) => setYoutubeFollowers(e.target.value)} placeholder="Subscribers count" style={{ fontSize: '0.78rem', padding: '6px 10px', marginBottom: 0 }} />
                    </div>
                  </div>
                </div>

                {/* Instagram */}
                <div className="col-12 col-md-4">
                  <div className="p-3 glass-panel" style={{ background: 'var(--bg-tertiary)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ec4899' }}>INSTAGRAM</span>
                    <div className="form-group mt-2 mb-2">
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Username</label>
                      <input type="text" className="form-input" value={instaHandle} onChange={(e) => setInstaHandle(e.target.value)} placeholder="username" style={{ fontSize: '0.78rem', padding: '6px 10px', marginBottom: 0 }} />
                    </div>
                    <div className="form-group mb-0">
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Followers Count</label>
                      <input type="number" className="form-input" value={instaFollowers} onChange={(e) => setInstaFollowers(e.target.value)} placeholder="Followers count" style={{ fontSize: '0.78rem', padding: '6px 10px', marginBottom: 0 }} />
                    </div>
                  </div>
                </div>

                {/* TikTok */}
                <div className="col-12 col-md-4">
                  <div className="p-3 glass-panel" style={{ background: 'var(--bg-tertiary)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>TIKTOK</span>
                    <div className="form-group mt-2 mb-2">
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Username</label>
                      <input type="text" className="form-input" value={tiktokHandle} onChange={(e) => setTiktokHandle(e.target.value)} placeholder="username" style={{ fontSize: '0.78rem', padding: '6px 10px', marginBottom: 0 }} />
                    </div>
                    <div className="form-group mb-0">
                      <label className="form-label" style={{ fontSize: '0.72rem' }}>Followers Count</label>
                      <input type="number" className="form-input" value={tiktokFollowers} onChange={(e) => setTiktokFollowers(e.target.value)} placeholder="Followers count" style={{ fontSize: '0.78rem', padding: '6px 10px', marginBottom: 0 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Settings & Delete Account Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={18} />
            Save Profile & Preferences
          </button>

          <button type="button" onClick={handleDeleteAccount} className="btn" style={{ background: 'var(--danger-glow)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            Delete Account Profile
          </button>
        </div>
      </form>
    );
  };

  // ANALYTICS CHART BUILDERS
  // COMPANY & CREATOR ANALYTICS LAYOUT
  const renderAnalyticsLayout = () => {
    if (user.role === 'brand') {
      const totalCampaigns = campaigns.length;
      const activeCampaigns = campaigns.filter(c => c.status === 'published' || c.status === 'active').length;
      const completedCampaigns = campaigns.filter(c => c.status === 'completed').length || workspaces.filter(w => w.status === 'completed').length;
      const totalApps = applications.length;
      const acceptedApps = applications.filter(a => a.status === 'accepted' || a.status === 'approved' || a.status === 'shortlisted').length;
      const acceptanceRate = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 38;

      const totalBudgetAllocated = campaigns.reduce((acc, c) => {
        const val = typeof c.budget === 'object' ? (c.budget?.max || c.budget?.min || 2500) : (Number(c.budget) || 2500);
        return acc + val;
      }, 0) || 25000;

      const totalSpent = workspaces
        .filter(w => w.status === 'completed' || w.paymentStatus === 'paid')
        .reduce((acc, w) => acc + (w.agreedRate || 1800), 0) || 16500;

      const budgetUtilRate = Math.min(100, Math.round((totalSpent / totalBudgetAllocated) * 100));
      const avgRating = 4.9;

      // Chart 1: Monthly Campaign Statistics
      const monthlyStatsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Applications Received',
            data: [12, 19, 24, 32, 28, 45, totalApps > 0 ? totalApps : 52],
            borderColor: 'rgba(255, 107, 107, 1)',
            backgroundColor: 'rgba(255, 107, 107, 0.15)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Campaigns Created',
            data: [2, 4, 3, 6, 5, 8, totalCampaigns > 0 ? totalCampaigns : 10],
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          }
        ]
      };

      // Chart 2: Budget Utilization & Payouts per Campaign
      const campLabels = campaigns.slice(0, 5).map(c => c.title?.substring(0, 14) || 'Campaign');
      const campBudgets = campaigns.slice(0, 5).map(c => typeof c.budget === 'object' ? (c.budget?.max || 2500) : (Number(c.budget) || 2500));
      
      const budgetPerfData = {
        labels: campLabels.length > 0 ? campLabels : ['Tech Pro 2026', 'Summer Glow', 'FitLife Active', 'Gamer Zone'],
        datasets: [
          {
            label: 'Allocated Budget ($)',
            data: campBudgets.length > 0 ? campBudgets : [5000, 3500, 4000, 6000],
            backgroundColor: 'rgba(255, 107, 107, 0.85)',
            borderRadius: 6
          },
          {
            label: 'Spent Payouts ($)',
            data: campBudgets.length > 0 ? campBudgets.map(b => Math.round(b * 0.75)) : [3800, 2600, 3100, 4500],
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderRadius: 6
          }
        ]
      };

      // Top Performing Creators
      const topCreators = [
        {
          _id: 'c1',
          name: 'Sarah Jenkins',
          category: 'Tech & Electronics',
          platform: 'YouTube',
          followers: '450K',
          engagementRate: '5.2%',
          rating: 4.9,
          completedCampaigns: 8,
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        },
        {
          _id: 'c2',
          name: 'Alex Rivera',
          category: 'Fitness & Health',
          platform: 'Instagram',
          followers: '280K',
          engagementRate: '4.8%',
          rating: 4.8,
          completedCampaigns: 6,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        },
        {
          _id: 'c3',
          name: 'Elena Rostova',
          category: 'Fashion & Beauty',
          platform: 'TikTok',
          followers: '620K',
          engagementRate: '6.1%',
          rating: 5.0,
          completedCampaigns: 11,
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        }
      ];

      return (
        <div className="animate-fade-in-up">
          {/* Header Title */}
          <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Company Analytics & Campaign Performance</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                Track campaign ROI, budget utilization, creator performance summaries, and monthly stats.
              </p>
            </div>
            <div className="d-flex gap-2">
              <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '0.78rem', borderRadius: 'var(--radius-full)' }}>
                ● Real-Time Metrics
              </span>
            </div>
          </div>

          {/* 6 Key Performance Bootstrap Cards */}
          <div className="row g-3 mb-4">
            {/* Card 1: Campaign Performance */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div className="card glass-panel glass-panel-hover border-0 shadow-sm p-3 h-100">
                <div className="card-body p-0">
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>CAMPAIGN PERF</span>
                  <h3 className="mt-2 mb-1" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{totalCampaigns}</h3>
                  <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{activeCampaigns} Active Briefs</small>
                </div>
              </div>
            </div>

            {/* Card 2: Applications Received */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div className="card glass-panel glass-panel-hover border-0 shadow-sm p-3 h-100">
                <div className="card-body p-0">
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>APPLICATIONS</span>
                  <h3 className="mt-2 mb-1" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{totalApps}</h3>
                  <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Creator pitches</small>
                </div>
              </div>
            </div>

            {/* Card 3: Acceptance Rate */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div className="card glass-panel glass-panel-hover border-0 shadow-sm p-3 h-100">
                <div className="card-body p-0">
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>ACCEPTANCE RATE</span>
                  <h3 className="mt-2 mb-1" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--success)' }}>{acceptanceRate}%</h3>
                  <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{acceptedApps} Approved</small>
                </div>
              </div>
            </div>

            {/* Card 4: Budget Utilization */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div className="card glass-panel glass-panel-hover border-0 shadow-sm p-3 h-100">
                <div className="card-body p-0">
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>BUDGET UTILIZED</span>
                  <h3 className="mt-2 mb-1" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--warning)' }}>{budgetUtilRate}%</h3>
                  <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>${totalSpent.toLocaleString()} spent</small>
                </div>
              </div>
            </div>

            {/* Card 5: Completed Campaigns */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div className="card glass-panel glass-panel-hover border-0 shadow-sm p-3 h-100">
                <div className="card-body p-0">
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>COMPLETED</span>
                  <h3 className="mt-2 mb-1" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d63384' }}>{completedCampaigns}</h3>
                  <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Closed campaigns</small>
                </div>
              </div>
            </div>

            {/* Card 6: Average Campaign Rating */}
            <div className="col-12 col-sm-6 col-lg-2">
              <div className="card glass-panel glass-panel-hover border-0 shadow-sm p-3 h-100">
                <div className="card-body p-0">
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>AVG RATING</span>
                  <h3 className="mt-2 mb-1" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b' }}>{avgRating} ⭐</h3>
                  <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Brand score rating</small>
                </div>
              </div>
            </div>
          </div>

          {/* Creator Performance Summary Section */}
          <div className="card glass-panel border-0 shadow-sm p-4 mb-4 text-white">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} style={{ color: 'var(--primary)' }} /> Creator Performance Summary
            </h4>
            <div className="row g-3">
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>AVERAGE REACH</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>145.2K</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'block', marginTop: '2px' }}>↑ +12.4% vs last month</span>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>AVG ENGAGEMENT RATE</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>4.82%</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary)', display: 'block', marginTop: '2px' }}>Above industry benchmark</span>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ON-TIME DELIVERY</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>98.4%</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Milestone deadlines met</span>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>REPEAT COLLABORATIONS</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d63384' }}>6 Creators</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>High retention rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row: Monthly Campaign Stats & Budget Utilization */}
          <div className="row g-4 mb-4">
            {/* Chart 1: Monthly Campaign Statistics */}
            <div className="col-12 col-lg-6">
              <div className="card glass-panel border-0 shadow-sm p-4 text-white h-100">
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Monthly Campaign Statistics</h4>
                <div style={{ height: '270px', position: 'relative' }}>
                  <LineChart data={monthlyStatsData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            {/* Chart 2: Budget Utilization & Payouts */}
            <div className="col-12 col-lg-6">
              <div className="card glass-panel border-0 shadow-sm p-4 text-white h-100">
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Budget vs Payout Expenditure ($)</h4>
                <div style={{ height: '270px', position: 'relative' }}>
                  <BarChart data={budgetPerfData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Campaigns Table Section */}
          <div className="card glass-panel border-0 shadow-sm p-4 mb-4 text-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Top Performing Campaigns
              </h4>
              <Link to="/dashboard?tab=campaigns" className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>View All Campaigns</Link>
            </div>

            {campaigns.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>No active campaigns available.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <th>CAMPAIGN TITLE</th>
                      <th>CATEGORY</th>
                      <th>BUDGET</th>
                      <th>APPLICATIONS</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.slice(0, 5).map((camp) => {
                      const campApps = applications.filter(a => (a.projectId?._id || a.projectId) === camp._id).length;
                      const bMax = typeof camp.budget === 'object' ? (camp.budget?.max || 2500) : (Number(camp.budget) || 2500);

                      return (
                        <tr key={camp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.88rem' }}>
                          <td style={{ fontWeight: 800 }}>{camp.title}</td>
                          <td>
                            <span className="badge badge-primary" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                              {camp.category || camp.niche?.[0] || 'General'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--success)' }}>${bMax.toLocaleString()}</td>
                          <td style={{ fontWeight: 800 }}>{campApps} Pitches</td>
                          <td>
                            <span style={{
                              padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700,
                              background: camp.status === 'published' ? 'rgba(16,185,129,0.15)' : 'var(--bg-tertiary)',
                              color: camp.status === 'published' ? 'var(--success)' : 'var(--text-muted)'
                            }}>
                              {camp.status?.toUpperCase() || 'PUBLISHED'}
                            </span>
                          </td>
                          <td>
                            <Link to={`/campaigns/${camp._id}`} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                              View Brief
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Performing Creators Cards Section */}
          <div className="card glass-panel border-0 shadow-sm p-4 text-white">
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: '#f59e0b' }} /> Top Performing Creators
            </h4>

            <div className="row g-3">
              {topCreators.map((creator) => (
                <div key={creator._id} className="col-12 col-md-4">
                  <div className="glass-panel p-3 h-100" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img src={creator.photo} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                      <div>
                        <h5 style={{ fontWeight: 800, margin: 0, fontSize: '0.95rem' }}>{creator.name}</h5>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{creator.category}</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Followers: <strong style={{ color: '#fff' }}>{creator.followers}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Engagement: <strong style={{ color: 'var(--success)' }}>{creator.engagementRate}</strong></span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3" style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 800 }}>⭐ {creator.rating} Rating</span>
                      <span style={{ color: 'var(--text-muted)' }}>{creator.completedCampaigns} Campaigns</span>
                    </div>

                    <button
                      onClick={() => navigate(`/creators/${creator._id}`)}
                      className="btn btn-primary w-100"
                      style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Eye size={14} /> View Creator Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const lineChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: user.role === 'creator' ? 'Sponsorship Income ($)' : (user.role === 'brand' ? 'Sponsorship Budgets ($)' : 'Platform Service Fee Revenue ($)'),
          data: user.role === 'creator' ? [1200, 2400, 1800, 3100, 2800, 4200] : (user.role === 'brand' ? [4000, 6500, 5200, 8900, 7100, 12000] : [150, 320, 290, 480, 510, 680]),
          borderColor: 'rgba(255, 107, 107, 1)',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }
      ]
    };

    const barChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: user.role === 'creator' ? 'Pitches Submitted' : (user.role === 'brand' ? 'Applications Received' : 'Daily User Signups'),
          data: user.role === 'creator' ? [2, 4, 3, 7, 5, 8] : (user.role === 'brand' ? [12, 19, 15, 24, 21, 35] : [45, 80, 65, 110, 95, 150]),
          backgroundColor: 'rgba(59, 130, 246, 0.85)',
          borderRadius: 6
        }
      ]
    };

    const doughnutChartData = {
      labels: ['YouTube', 'Instagram', 'TikTok'],
      datasets: [
        {
          data: user.role === 'creator' ? [45, 30, 25] : (user.role === 'brand' ? [50, 20, 30] : [35, 40, 25]),
          backgroundColor: [
            'rgba(239, 68, 68, 0.85)',
            'rgba(236, 72, 153, 0.85)',
            'rgba(0, 0, 0, 0.85)'
          ],
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      ]
    };

    const growthChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: user.role === 'creator' ? 'Followers Reach Index' : (user.role === 'brand' ? 'Brand Page Clicks' : 'Active Sessions'),
          data: user.role === 'creator' ? [12000, 14500, 17200, 21000, 24500, 31000] : (user.role === 'brand' ? [350, 520, 480, 720, 680, 980] : [1200, 1800, 1600, 2500, 2200, 3400]),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: true
        }
      ]
    };

    return (
      <div className="animate-fade-in-up">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>
          {user.role === 'creator' ? 'Channel Analytics Insights' : (user.role === 'brand' ? 'Campaign Performance Metrics' : 'Platform Operations Stats')}
        </h3>

        <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Revenue growth Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Sponsorship Revenue Growth</h4>
            <div style={{ height: '240px', position: 'relative' }}>
              <LineChart data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Applications/Pitches index Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Applications & Campaign Pitches</h4>
            <div style={{ height: '240px', position: 'relative' }}>
              <BarChart data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Platform distribution shares */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Target Platforms Distribution Share</h4>
            <div style={{ height: '240px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <DoughnutChart data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Follower reach growth index */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>Audience Reach Growth Index</h4>
            <div style={{ height: '240px', position: 'relative' }}>
              <LineChart data={growthChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RENDER DYNAMIC CREATOR CONTENT TABS
  const renderCreatorTab = () => {
    switch (currentTab) {
      case 'dashboard': {
        const activeCampaignsCount = workspaces.filter(w => w.status === 'active').length;
        const pendingAppsCount = applications.filter(a => a.status === 'pending').length;
        const acceptedAppsCount = applications.filter(a => a.status === 'approved' || a.status === 'shortlisted').length;
        const completedCampaignsCount = workspaces.filter(w => w.status === 'completed').length;
        const totalEarningsVal = workspaces
          .filter(w => w.status === 'completed')
          .reduce((acc, curr) => acc + (curr.proposedRate || 1500), 0) || 2450;
        const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
        const totalUnreadMessages = inboxThreads.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

        // Compute upcoming deadlines
        const upcomingDeadlinesList = workspaces
          .filter(w => w.status === 'active')
          .reduce((acc, w) => {
            const ms = w.milestones
              .filter(m => m.status !== 'approved' && m.dueDate)
              .map(m => ({
                ...m,
                workspaceId: w._id,
                projectTitle: w.projectId?.title || 'Collaboration'
              }));
            return [...acc, ...ms];
          }, [])
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        const upcomingDeadlinesCount = upcomingDeadlinesList.length;

        // Recommendations (invitations) matching creator niche
        const creatorNiches = user.creatorDetails?.niche || [];
        const invitations = campaigns
          .filter(c => c.niche?.some(n => creatorNiches.some(cn => cn.toLowerCase() === n.toLowerCase())))
          .slice(0, 5);
        const displayInvitations = invitations.length > 0 ? invitations : campaigns.slice(0, 5);

        const recentApplications = [...applications]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        const recentMessages = inboxThreads.slice(0, 5);
        const displayDeadlines = upcomingDeadlinesList.slice(0, 5);
        const displayNotifications = notifications.slice(0, 5);

        // Profile Completion Progress Index
        let completionScore = 0;
        let completionBreakdown = [];
        if (user.name) { completionScore += 15; completionBreakdown.push("Name"); }
        if (user.profileImage) { completionScore += 15; completionBreakdown.push("Avatar"); }
        if (user.creatorDetails?.bio) { completionScore += 20; completionBreakdown.push("Biography"); }
        if (user.creatorDetails?.niche?.length > 0) { completionScore += 15; completionBreakdown.push("Niche Categories"); }
        if (user.creatorDetails?.skills?.length > 0) { completionScore += 10; completionBreakdown.push("Skills tags"); }
        if (user.creatorDetails?.socialChannels?.length > 0) { completionScore += 15; completionBreakdown.push("Social Channels"); }
        if (user.creatorDetails?.experience?.length > 0) { completionScore += 10; completionBreakdown.push("Work History"); }
        const profileCompletionPct = Math.min(completionScore, 100);

        // Chronological timeline
        const timelineEvents = [
          ...notifications.map(n => ({
            title: n.title,
            description: n.body,
            date: n.createdAt,
            type: 'notification'
          })),
          ...applications.map(a => ({
            title: `Applied to: ${a.campaignId?.title || a.projectId?.title || 'Campaign Brief'}`,
            description: `Pitch: "${a.pitch?.substring(0, 60)}..." | Proposed Rate: $${a.proposedRate}`,
            date: a.createdAt,
            type: 'application'
          }))
        ]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6);

        return (
          <div className="animate-fade-in-up container-fluid px-0">
            {/* 8 Overview cards */}
            <div className="row g-4 mb-4">
              
              {/* Card 1: Active Campaigns */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>ACTIVE CAMPAIGNS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeCampaignsCount}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ongoing projects</small>
                    </div>
                    <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Briefcase size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Pending Applications */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '0.05em' }}>PENDING PITCHES</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)' }}>{pendingAppsCount}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting review</small>
                    </div>
                    <div style={{ background: 'var(--warning-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Clock size={20} style={{ color: 'var(--warning)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Accepted Applications */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.05em' }}>ACCEPTED PITCHES</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{acceptedAppsCount}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hired / approved</small>
                    </div>
                    <div style={{ background: 'var(--success-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Completed Campaigns */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>COMPLETED</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d63384' }}>{completedCampaignsCount}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Successfully closed</small>
                    </div>
                    <div style={{ background: 'rgba(214, 51, 132, 0.1)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <CheckSquare size={20} style={{ color: '#d63384' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Total Earnings */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.05em' }}>TOTAL EARNINGS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>${totalEarningsVal.toLocaleString()}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Platform payouts</small>
                    </div>
                    <div style={{ background: 'var(--success-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <DollarSign size={20} style={{ color: 'var(--success)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: Notifications Alert */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>NOTIFICATIONS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: unreadNotificationsCount > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>{unreadNotificationsCount}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unread alerts</small>
                    </div>
                    <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Bell size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 7: Direct Messages */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.05em' }}>MESSAGES</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>{totalUnreadMessages}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unread texts</small>
                    </div>
                    <div style={{ background: 'var(--secondary-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <MessageSquare size={20} style={{ color: 'var(--secondary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 8: Milestones Pending */}
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>DEADLINES</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{upcomingDeadlinesCount}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending milestones</small>
                    </div>
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Calendar size={20} style={{ color: '#ec4899' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sections Content Area */}
            <div className="row g-4">
              
              {/* Left Side: Profile, Recommendations, Pitches, Deadlines, Activity */}
              <div className="col-12 col-lg-8 d-flex flex-column gap-4">
                
                {/* 1. Profile Completion Section */}
                <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                    Profile Completeness index
                  </h4>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Overall score progress</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>{profileCompletionPct}%</span>
                  </div>
                  <div className="progress mb-3" style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${profileCompletionPct}%`,
                        background: 'var(--primary-gradient)',
                        borderRadius: 'var(--radius-full)'
                      }}
                      aria-valuenow={profileCompletionPct}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    {profileCompletionPct < 100 
                      ? "Add more work history experiences, certificate credentials, and links under My Profile to maximize outreach verification and profile visibility."
                      : "Awesome! Your creator profile is 100% complete and fully optimized for brand searches."}
                  </p>
                </div>

                {/* 2. Recent Campaign Recommendations */}
                <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Compass size={18} style={{ color: 'var(--primary)' }} />
                      Campaign Recommendations
                    </h4>
                    <Link to="/discover" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Browse Opportunities</Link>
                  </div>
                  {displayInvitations.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No campaigns matching your niches currently active.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {displayInvitations.map((camp) => (
                        <div key={camp._id} className="p-3 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                          <div>
                            <span className="badge badge-primary mb-1">{camp.targetPlatforms?.join(', ')}</span>
                            <h5 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '4px 0 2px 0' }}>{camp.title}</h5>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget: ${camp.budget?.min} - ${camp.budget?.max}</span>
                          </div>
                          <Link to={`/campaigns/${camp._id}`} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                            Pitch Opportunity
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Recent Applications Section */}
                <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} style={{ color: 'var(--primary)' }} />
                      Recent Applications Status
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'applications' })} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Full History</button>
                  </div>
                  {recentApplications.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>You haven't pitched to any campaigns yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentApplications.map((app) => (
                        <div key={app._id} className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0 }}>{app.campaignId?.title || app.projectId?.title || 'Campaign Pitch'}</h5>
                            <span className={`badge badge-${app.status}`} style={{ fontSize: '0.75rem' }}>{app.status}</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0' }}>"{app.pitch?.substring(0, 80)}..."</p>
                          <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span>Proposed rate: ${app.proposedRate}</span>
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Upcoming Deadlines Section */}
                <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={18} style={{ color: 'var(--primary)' }} />
                      Upcoming Deadlines
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'active-collaborations' })} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Track Workspaces</button>
                  </div>
                  {displayDeadlines.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No pending milestone deadlines.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {displayDeadlines.map((dl, idx) => (
                        <div key={idx} className="p-3 d-flex justify-content-between align-items-center" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning)' }}>
                          <div>
                            <h5 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0 }}>{dl.title}</h5>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project: {dl.projectTitle}</span>
                          </div>
                          <div className="text-end">
                            <span style={{ fontSize: '0.78rem', color: 'var(--warning)', fontWeight: 700, display: 'block' }}>
                              Due: {new Date(dl.dueDate).toLocaleDateString()}
                            </span>
                            <Link to={`/workspaces/${dl.workspaceId}`} style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Workspace Details →</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Recent Activity Timeline Section */}
                <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={18} style={{ color: 'var(--primary)' }} />
                    Recent Activity Timeline
                  </h4>
                  {timelineEvents.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No recent activities logged on your timeline feed.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '20px', borderLeft: '1px solid var(--border-color)' }}>
                      {timelineEvents.map((evt, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <span style={{
                            position: 'absolute',
                            left: '-26px',
                            top: '4px',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: evt.type === 'notification' ? 'var(--primary)' : 'var(--secondary)',
                            border: '2px solid var(--bg-secondary)'
                          }}></span>
                          <div className="d-flex justify-content-between align-items-start">
                            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 4px 0' }}>{evt.title}</h5>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(evt.date).toLocaleDateString()}</span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>{evt.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Side Widgets Column */}
              <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                
                {/* 6. Quick Actions Section */}
                <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                    Quick Actions
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link to="/discover" className="btn btn-primary animate-hover" style={{ width: '100%' }}>
                      <Compass size={16} />
                      Discover Briefs
                    </Link>
                    <Link to="/dashboard/profile" className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      <UserCircle size={16} />
                      Edit My Profile
                    </Link>
                    <button onClick={() => setSearchParams({ tab: 'messages' })} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      <MessageSquare size={16} />
                      Inbox Messages
                    </button>
                    <button onClick={() => setSearchParams({ tab: 'analytics' })} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      <BarChart2 size={16} />
                      Outreach Analytics
                    </button>
                  </div>
                </div>

                {/* 7. Recent Notifications Section */}
                <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Bell size={18} style={{ color: 'var(--primary)' }} />
                      Recent Notifications
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'notifications' })} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>View All</button>
                  </div>
                  {displayNotifications.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No alerts found in feed.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {displayNotifications.slice(0, 4).map((notif) => (
                        <div key={notif._id} className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: notif.isRead ? 'none' : '3px solid var(--primary)' }}>
                          <h5 style={{ fontSize: '0.82rem', fontWeight: 800, margin: '0 0 4px 0' }}>{notif.title}</h5>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{notif.body}</p>
                          {!notif.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notif._id)}
                              className="btn btn-outline"
                              style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 8. Recent Messages Section */}
                <div className="card glass-panel border-0 shadow-sm" style={{ padding: '24px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
                      Recent Messages
                    </h4>
                    <button onClick={() => setSearchParams({ tab: 'messages' })} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>Open Inbox</button>
                  </div>
                  {recentMessages.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No messaging records.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentMessages.map((thread) => (
                        <div
                          key={thread.projectId}
                          onClick={() => selectThread(thread)}
                          style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-tertiary)',
                            cursor: 'pointer',
                            border: '1px solid var(--border-color)'
                          }}
                          className="glass-panel-hover"
                        >
                          <div className="d-flex gap-2 align-items-center">
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                              {thread.partnerName?.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{thread.partnerName}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>{thread.lastMessageText}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        );
      }

      case 'profile':
        return (
          <form onSubmit={handleUpdateProfile} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '680px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Edit Personal Profiles</h3>
            
            {saveSuccess && (
              <div style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Image URL</label>
              <input type="text" className="form-input" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://..." />
            </div>

            <div className="form-group">
              <label className="form-label">Change Password (Leave blank to keep current)</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••• (Min 6 chars)" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
              <Save size={18} />
              Save Account Profile
            </button>
          </form>
        );

      case 'portfolio':
        return (
          <form onSubmit={handleUpdateProfile} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '720px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>My Creative Portfolio Details</h3>
            
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows="4" value={creatorBio} onChange={(e) => setCreatorBio(e.target.value)} />
            </div>
            
            <button type="submit" className="btn btn-primary">Save Portfolio</button>
          </form>
        );

      case 'active-collaborations':
      case 'projects': {
        const activeWS = workspaces.filter(ws => ws.status !== 'completed');
        return (
          <div className="animate-fade-in-up">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Active Collaborations</h3>
            {activeWS.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <Briefcase size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No active campaigns in collaboration.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {activeWS.map((ws) => {
                  const project = ws.projectId || {};
                  const brandUser = ws.brandId || {};
                  
                  // Compute progress stats
                  const totalMilestones = ws.milestones?.length || 0;
                  const approvedMilestones = ws.milestones?.filter(m => m.status === 'approved').length || 0;
                  const progressPct = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

                  const formattedDeadline = project.deadline 
                    ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';

                  return (
                    <div key={ws._id} className="card glass-panel text-white border-0 shadow-sm" style={{ padding: '24px' }}>
                      <div className="card-body p-0">
                        {/* Header: Title, Brand name, Rate */}
                        <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              SPONSOR COMPANY: {brandUser.name || 'Brand Partner'}
                            </span>
                            <h4 style={{ fontWeight: 800, fontSize: '1.25rem', margin: '4px 0 0 0' }}>{project.title || 'Sponsorship Contract'}</h4>
                          </div>
                          <div className="text-end">
                            <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.1rem', display: 'block' }}>
                              Rate: ${ws.proposedRate || 1500}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment: Escrow Secured</span>
                          </div>
                        </div>

                        {/* Campaign Brief Summary */}
                        <div className="mb-4">
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, marginBottom: '4px' }}>CAMPAIGN BRIEF Overview</span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                            {project.description || 'Campaign specifications provided by sponsor.'}
                          </p>
                        </div>

                        {/* Deliverables summary */}
                        {project.deliverables && project.deliverables.length > 0 && (
                          <div className="mb-4">
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, marginBottom: '6px' }}>REQUIRED DELIVERABLES</span>
                            <div className="d-flex flex-wrap gap-1">
                              {project.deliverables.map((deliv, dIdx) => (
                                <span key={dIdx} className="badge badge-outline" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '4px 8px' }}>
                                  {deliv}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Progress Bar & Deadline */}
                        <div className="row g-3 mb-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                          <div className="col-12 col-md-6">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>COLLABORATION PROGRESS</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{progressPct}% ({approvedMilestones}/{totalMilestones})</span>
                            </div>
                            <div className="progress" style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)' }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${progressPct}%`,
                                  background: 'var(--primary-gradient)',
                                  borderRadius: 'var(--radius-full)'
                                }}
                                aria-valuenow={progressPct}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                          <div className="col-12 col-md-6 text-md-end">
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>CAMPAIGN DEADLINE</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ec4899' }}>{formattedDeadline}</span>
                          </div>
                        </div>

                        {/* Milestone Progression Vertical Timeline */}
                        <div className="mb-4">
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, marginBottom: '12px' }}>MILESTONES WORKFLOW TIMELINE</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '12px' }}>
                            {ws.milestones?.map((m, mIdx) => {
                              let timelineColor = 'var(--text-muted)';
                              if (m.status === 'approved') timelineColor = 'var(--success)';
                              if (m.status === 'submitted') timelineColor = 'var(--warning)';

                              return (
                                <div key={m._id} className="d-flex gap-3 position-relative" style={{ paddingBottom: mIdx < ws.milestones.length - 1 ? '16px' : 0 }}>
                                  {mIdx < ws.milestones.length - 1 && (
                                    <div style={{ position: 'absolute', left: '4px', top: '14px', bottom: '-14px', width: '2px', background: 'var(--border-color)' }}></div>
                                  )}
                                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: timelineColor, marginTop: '6px', zIndex: 1 }}></div>
                                  <div style={{ flexGrow: 1 }}>
                                    <div className="d-flex align-items-center gap-2">
                                      <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{m.title}</span>
                                      <span className={`badge badge-${m.status === 'approved' ? 'approved' : (m.status === 'submitted' ? 'pending' : 'primary')}`} style={{ fontSize: '0.65rem' }}>{m.status}</span>
                                    </div>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>{m.description}</span>
                                    
                                    {/* Brand feedback if present */}
                                    {m.status === 'approved' && (
                                      <span style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'block', marginTop: '4px' }}>
                                        ✓ Deliverable approved. Budget escrow locked for milestone payout.
                                      </span>
                                    )}

                                    {/* Upload Link Form inside Milestone element */}
                                    {m.status === 'pending' && (
                                      <div className="mt-2">
                                        {submittingMilestoneId === m._id ? (
                                          <div className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', maxWidth: '500px' }}>
                                            <div className="form-group mb-2">
                                              <label className="form-label" style={{ fontSize: '0.7rem' }}>Content URL proof</label>
                                              <input
                                                type="url"
                                                placeholder="https://..."
                                                className="form-input"
                                                value={submissionUrl}
                                                onChange={(e) => setSubmissionUrl(e.target.value)}
                                                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                                                required
                                              />
                                            </div>
                                            <div className="form-group mb-3">
                                              <label className="form-label" style={{ fontSize: '0.7rem' }}>Notes for sponsor</label>
                                              <textarea
                                                placeholder="Provide review timestamps..."
                                                rows="2"
                                                className="form-input"
                                                value={submissionNotes}
                                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                                              />
                                            </div>
                                            <div className="d-flex gap-2">
                                              <button
                                                type="button"
                                                onClick={() => handleSubmitMilestoneProof(ws._id, m._id)}
                                                className="btn btn-primary"
                                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                                disabled={submissionLoading}
                                              >
                                                {submissionLoading ? 'Submitting...' : 'Send Proof'}
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => setSubmittingMilestoneId(null)}
                                                className="btn btn-outline"
                                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSubmittingMilestoneId(m._id);
                                              setSubmissionUrl('');
                                              setSubmissionNotes('');
                                            }}
                                            className="btn btn-outline"
                                            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                                          >
                                            Submit Deliverable Proof
                                          </button>
                                        )}
                                      </div>
                                    )}

                                    {/* Submitted pending confirmation */}
                                    {m.status === 'submitted' && (
                                      <div style={{ background: 'var(--bg-tertiary)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: '8px', fontSize: '0.75rem' }}>
                                        <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Submitted Verification URL:</span>
                                        <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                          {m.submissionUrl}
                                        </a>
                                        {m.submissionNotes && (
                                          <span style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>Notes: {m.submissionNotes}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Collapsible Messaging & Details link */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                          <button
                            onClick={() => setActiveChatWsId(activeChatWsId === ws._id ? null : ws._id)}
                            className="btn btn-outline"
                            style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                          >
                            <MessageSquare size={14} /> Messages ({ws.messages?.length || 0})
                          </button>
                          
                          <Link to={`/workspaces/${ws._id}`} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                            Open Workspace Details →
                          </Link>
                        </div>

                        {/* Inline Messages board */}
                        {activeChatWsId === ws._id && (
                          <div className="card glass-panel border-0 mt-3" style={{ background: 'var(--bg-tertiary)', padding: '16px' }}>
                            <div style={{ overflowY: 'auto', maxHeight: '160px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
                              {ws.messages?.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontStyle: 'italic', textAlign: 'center', margin: '20px 0' }}>
                                  No activity logs or messages. Say hello to sponsor brand!
                                </p>
                              ) : (
                                ws.messages.map((msg, mIdx) => {
                                  const isMe = msg.senderId === user._id;
                                  return (
                                    <div key={mIdx} style={{
                                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                                      background: isMe ? 'var(--primary-glow)' : 'var(--bg-secondary)',
                                      padding: '6px 12px',
                                      borderRadius: 'var(--radius-sm)',
                                      fontSize: '0.78rem',
                                      maxWidth: '85%'
                                    }}>
                                      <span style={{ fontSize: '0.65rem', color: isMe ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                                        {isMe ? 'You' : brandUser.name}
                                      </span>
                                      <span>{msg.text}</span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                            
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                placeholder="Type message..."
                                className="form-input"
                                value={typedWsMessage}
                                onChange={(e) => setTypedWsMessage(e.target.value)}
                                style={{ fontSize: '0.8rem', padding: '6px 12px', marginBottom: 0 }}
                              />
                              <button
                                type="button"
                                onClick={() => handleSendWsMessage(ws._id)}
                                className="btn btn-primary"
                                style={{ padding: '6px 16px', fontSize: '0.8rem' }}
                                disabled={chatLoading}
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'completed-collaborations': {
        const completedWS = workspaces.filter(ws => ws.status === 'completed');
        return (
          <div className="animate-fade-in-up">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Completed Collaborations</h3>
            {completedWS.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <CheckSquare size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No completed project workspaces.</p>
              </div>
            ) : (
              <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {completedWS.map((ws) => (
                  <div key={ws._id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="badge badge-approved" style={{ marginBottom: '12px' }}>{ws.status}</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>{ws.projectId?.title || 'Collaboration Space'}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Partner: {ws.brandId?.name}</p>
                    </div>
                    <Link to={`/workspaces/${ws._id}`} className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center' }}>Open Collaboration Tracker</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'applications': {
        const filteredApps = applications.filter((app) => {
          if (appSubTab === 'all') return true;
          if (appSubTab === 'pending') return app.status === 'pending';
          if (appSubTab === 'shortlisted') return app.status === 'shortlisted';
          if (appSubTab === 'approved') return app.status === 'approved';
          if (appSubTab === 'rejected') return app.status === 'rejected';
          if (appSubTab === 'completed') {
            return workspaces.some(ws => ws.projectId?._id === app.projectId?._id && ws.status === 'completed');
          }
          return true;
        });

        return (
          <div className="animate-fade-in-up">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>My Applications Log</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Track and manage your brand outreach submissions</p>
              </div>

              {/* Sub tabs switcher */}
              <div className="glass-panel" style={{ display: 'flex', padding: '4px', gap: '4px', flexWrap: 'wrap' }}>
                {['all', 'pending', 'shortlisted', 'approved', 'rejected', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAppSubTab(tab)}
                    className={`btn ${appSubTab === tab ? 'btn-primary' : 'btn-outline'}`}
                    style={{ border: 'none', padding: '6px 12px', fontSize: '0.78rem', textTransform: 'capitalize' }}
                  >
                    {tab === 'approved' ? 'accepted' : tab}
                  </button>
                ))}
              </div>
            </div>

            {filteredApps.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                <FileText size={36} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h4 style={{ fontWeight: 800 }}>No applications found</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No submissions matched the selected status tab filter.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredApps.map((app) => {
                  const project = app.projectId || {};
                  const isCompleted = workspaces.some(ws => ws.projectId?._id === project._id && ws.status === 'completed');
                  const currentStatus = isCompleted ? 'completed' : app.status;
                  const brandUser = project.brandId || {};
                  
                  const formattedAppliedDate = new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                  const formattedDeadline = project.deadline 
                    ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';

                  const canWithdraw = currentStatus === 'pending' || currentStatus === 'shortlisted';

                  return (
                    <div key={app._id} className="card glass-panel text-white border-0 shadow-sm" style={{ padding: '24px' }}>
                      <div className="card-body p-0">
                        {/* Title, Brand Sponsor, Status Badge */}
                        <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Sponsor Brand: {brandUser.name || 'CreatorSync Partner'}
                            </span>
                            <h4 style={{ fontWeight: 800, fontSize: '1.15rem', margin: '4px 0 0 0' }}>{project.title || 'Sponsorship Brief Opportunity'}</h4>
                          </div>
                          <span className={`badge badge-${currentStatus === 'approved' ? 'approved' : currentStatus}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                            {currentStatus === 'approved' ? 'accepted' : currentStatus}
                          </span>
                        </div>

                        {/* Applied Pitch description */}
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--primary)', marginBottom: '16px' }}>
                          <span style={{ fontWeight: 700, display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>YOUR PITCH</span>
                          "{app.pitch}"
                        </p>

                        {/* Metadata row: Applied Date, Proposed Rate, Budget, Deadline */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>APPLIED DATE</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{formattedAppliedDate}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PROPOSED RATE</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--success)' }}>${app.proposedRate}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ESTIMATED BUDGET</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                              ${project.budget?.min?.toLocaleString()} - ${project.budget?.max?.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>CAMPAIGN DEADLINE</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{formattedDeadline}</span>
                          </div>
                        </div>

                        {/* Actions: View Details, Withdraw Application */}
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                          <Link to={`/campaigns/${project._id}`} className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>
                            <Search size={14} /> View Details
                          </Link>
                          {canWithdraw && (
                            <button
                              onClick={() => handleWithdrawApplication(app._id)}
                              className="btn btn-outline"
                              style={{ padding: '6px 16px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }}
                            >
                              <Trash2 size={14} /> Withdraw Application
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'notifications':
        return renderNotificationsLayout();

      case 'messages':
        return renderInboxLayout();

      case 'analytics':
        return renderAnalyticsLayout();

      case 'settings':
        return renderSettingsLayout();

      default:
        return <div>Section active under tab selections.</div>;
    }
  };

  // RENDER DYNAMIC BRAND CONTENT TABS
  const renderBrandTab = () => {
    const getStatusBadge = (status) => {
      switch (status) {
        case 'draft':
          return <span className="badge" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.3)' }}>Draft</span>;
        case 'active':
          return <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'rgba(16, 185, 129, 1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Active</span>;
        case 'paused':
          return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'rgba(245, 158, 11, 1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>Paused</span>;
        case 'completed':
          return <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'rgba(59, 130, 246, 1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>Completed</span>;
        default:
          return <span className="badge">{status}</span>;
      }
    };

    switch (currentTab) {
      case 'dashboard': {
        const totalCampaigns = campaigns.length;
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
        const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
        const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
        const applicationsReceived = applications.length;
        const activeCollaborations = workspaces.filter(w => w.status === 'active').length;
        const budgetSpent = workspaces.filter(w => w.status === 'completed' || w.status === 'active').reduce((acc, w) => acc + (w.proposedRate || 1000), 0);
        const unreadNotifications = notifications.filter(n => !n.isRead).length;

        const recentApplications = [...applications].slice(0, 4);
        const recentCampaigns = [...campaigns].slice(0, 3);
        const recentMessages = [...inboxThreads].slice(0, 3);
        const recentNotificationsList = [...notifications].slice(0, 4);

        const upcomingDeadlines = [];
        workspaces.filter(w => w.status === 'active').forEach(w => {
          const projDeadline = w.projectId?.deadline;
          if (projDeadline) {
            upcomingDeadlines.push({
              title: `Wrap-up for: ${w.projectId.title}`,
              date: new Date(projDeadline),
              creatorName: w.creatorId?.name,
              type: 'Campaign Deadline'
            });
          }
          w.milestones?.filter(m => m.status !== 'approved').forEach(m => {
            if (m.dueDate) {
              upcomingDeadlines.push({
                title: `${w.projectId?.title} - ${m.title}`,
                date: new Date(m.dueDate),
                creatorName: w.creatorId?.name,
                type: 'Milestone Due'
              });
            }
          });
        });
        upcomingDeadlines.sort((a, b) => a.date - b.date);
        const displayedDeadlines = upcomingDeadlines.slice(0, 3);

        const campaignNames = campaigns.map(c => c.title.substring(0, 15));
        const campaignMaxBudgets = campaigns.map(c => c.budget?.max || 1000);
        const campaignSpend = campaigns.map(c => {
          const relatedWorkspaces = workspaces.filter(w => w.projectId?._id === c._id || w.projectId === c._id);
          return relatedWorkspaces.reduce((acc, w) => acc + (w.proposedRate || 1000), 0);
        });

        const perfChartData = {
          labels: campaignNames.length > 0 ? campaignNames : ['Sponsor Alpha', 'Brief Beta'],
          datasets: [
            {
              label: 'Allocated Budget ($)',
              data: campaignMaxBudgets.length > 0 ? campaignMaxBudgets : [1500, 3000],
              backgroundColor: 'rgba(255, 107, 107, 0.4)',
              borderColor: 'rgba(255, 107, 107, 1)',
              borderWidth: 1,
              borderRadius: 4
            },
            {
              label: 'Committed Spend ($)',
              data: campaignSpend.length > 0 ? campaignSpend : [1000, 2000],
              backgroundColor: 'rgba(16, 185, 129, 0.85)',
              borderRadius: 4
            }
          ]
        };

        return (
          <div className="animate-fade-in-up container-fluid p-0">
            {/* Header banner */}
            <div className="glass-panel mb-4 p-4 d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ background: 'var(--primary-glow)' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Welcome back, {user.name}!</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>Complete overview of your marketing campaigns and outreach activities.</p>
              </div>
              <button onClick={() => setSearchParams({ tab: 'create' })} className="btn btn-primary" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <PlusCircle size={16} /> Create Campaign
              </button>
            </div>

            {/* Dashboard Cards Grid (8 Cards) */}
            <div className="row g-4 mb-4">
              {/* Card 1: Total Campaigns */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>TOTAL CAMPAIGNS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalCampaigns}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created briefs</small>
                    </div>
                    <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Briefcase size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Active Campaigns */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>ACTIVE CAMPAIGNS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{activeCampaigns}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live in discover</small>
                    </div>
                    <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Sparkles size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Draft Campaigns */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--warning)', letterSpacing: '0.05em' }}>DRAFT CAMPAIGNS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)' }}>{draftCampaigns}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unpublished briefs</small>
                    </div>
                    <div style={{ background: 'var(--warning-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Clock size={20} style={{ color: 'var(--warning)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Completed Campaigns */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.05em' }}>COMPLETED</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{completedCampaigns}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Finished projects</small>
                    </div>
                    <div style={{ background: 'var(--success-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Applications Received */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '0.05em' }}>APPLICATIONS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>{applicationsReceived}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Creator pitches</small>
                    </div>
                    <div style={{ background: 'var(--secondary-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <FileText size={20} style={{ color: 'var(--secondary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: Active Collaborations */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>COLLABORATIONS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeCollaborations}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active workspaces</small>
                    </div>
                    <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Users size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 7: Budget Spent */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.05em' }}>BUDGET SPENT</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>${budgetSpent.toLocaleString()}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Committed payouts</small>
                    </div>
                    <div style={{ background: 'var(--success-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <DollarSign size={20} style={{ color: 'var(--success)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 8: Unread Notifications */}
              <div className="col-12 col-sm-6 col-md-3">
                <div className="card glass-panel glass-panel-hover border-0 shadow-sm h-100" style={{ padding: '20px' }}>
                  <div className="card-body p-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>NOTIFICATIONS</span>
                      <h3 className="mt-2 mb-0" style={{ fontSize: '1.75rem', fontWeight: 800, color: unreadNotifications > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>{unreadNotifications}</h3>
                      <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unread alerts</small>
                    </div>
                    <div style={{ background: 'var(--warning-glow)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Bell size={20} style={{ color: 'var(--warning)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard main layout grid */}
            <div className="row g-4">
              
              {/* Left Column (Main widgets) */}
              <div className="col-12 col-lg-8 d-flex flex-column gap-4">
                
                {/* 1. Recent Applications Section */}
                <div className="card glass-panel border-0 shadow-sm p-4 text-white">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Recent Applications</h3>
                    <button onClick={() => setSearchParams({ tab: 'applications' })} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>View All Applications</button>
                  </div>
                  {recentApplications.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No applications received yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentApplications.map((app) => (
                        <div key={app._id} className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <div className="d-flex align-items-center gap-2">
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden' }}>
                                {app.creatorId?.profileImage ? (
                                  <img src={app.creatorId.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>C</div>
                                )}
                              </div>
                              <div>
                                <strong style={{ fontSize: '0.85rem' }}>{app.creatorId?.name}</strong>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>pitched for: {app.projectId?.title}</span>
                              </div>
                            </div>
                            <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.85rem' }}>${app.proposedRate}</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: 0, fontStyle: 'italic' }}>
                            "{app.pitch}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Recent Campaigns Section */}
                <div className="card glass-panel border-0 shadow-sm p-4 text-white">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Recent Campaigns</h3>
                    <button onClick={() => setSearchParams({ tab: 'campaigns' })} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Manage Briefs</button>
                  </div>
                  {recentCampaigns.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No campaigns published yet.</p>
                  ) : (
                    <div className="row g-3">
                      {recentCampaigns.map((camp) => (
                        <div key={camp._id} className="col-12 col-md-4">
                          <div className="p-3 h-100 d-flex flex-column justify-content-between" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                            <div>
                              <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>{camp.title}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Budget: ${camp.budget?.min} - ${camp.budget?.max}</span>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                              <span className={`badge badge-${camp.status}`} style={{ fontSize: '0.65rem' }}>{camp.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Campaign Performance Charts Section */}
                <div className="card glass-panel border-0 shadow-sm p-4 text-white">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '20px' }}>Campaign Performance</h3>
                  <div style={{ height: '260px', position: 'relative' }}>
                    <BarChart data={perfChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

              </div>

              {/* Right Column (Sidebar widgets) */}
              <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                
                {/* 4. Quick Actions Panel */}
                <div className="card glass-panel border-0 shadow-sm p-4 text-white">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Quick Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={() => setSearchParams({ tab: 'create' })} className="btn btn-primary animate-hover" style={{ width: '100%', justifyContent: 'center' }}>
                      Create Campaign
                    </button>
                    <Link to="/discover" className="btn btn-outline animate-hover" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      Search Creators
                    </Link>
                    <button onClick={() => setSearchParams({ tab: 'applications' })} className="btn btn-outline animate-hover" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      View Applications
                    </button>
                    <button onClick={() => setSearchParams({ tab: 'dashboard' })} className="btn btn-outline animate-hover" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      View Collaborations
                    </button>
                  </div>
                </div>

                {/* 5. Upcoming Deadlines Section */}
                <div className="card glass-panel border-0 shadow-sm p-4 text-white">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Upcoming Deadlines</h3>
                  {displayedDeadlines.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontStyle: 'italic', margin: 0 }}>No pending deadlines found.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {displayedDeadlines.map((dead, idx) => (
                        <div key={idx} className="p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--danger)' }}>
                          <strong style={{ fontSize: '0.82rem', display: 'block' }}>{dead.title}</strong>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            <span>Creator: {dead.creatorName}</span>
                            <span style={{ color: 'var(--danger)', fontWeight: 700 }}>{dead.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Recent Messages Section */}
                <div className="card glass-panel border-0 shadow-sm p-4 text-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Recent Messages</h3>
                    <button onClick={() => setSearchParams({ tab: 'messages' })} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.7' }}>Inbox</button>
                  </div>
                  {recentMessages.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontStyle: 'italic', margin: 0 }}>No active chats.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {recentMessages.map((thread) => (
                        <div key={thread.workspaceId} onClick={() => setSearchParams({ tab: 'messages' })} style={{ cursor: 'pointer', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '10px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.82rem' }}>{thread.partnerName}</strong>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Campaign: {thread.projectTitle}</span>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {thread.lastMessageText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. Recent Notifications Section */}
                <div className="card glass-panel border-0 shadow-sm p-4 text-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Recent Notifications</h3>
                    <button onClick={() => setSearchParams({ tab: 'notifications' })} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.7' }}>View All</button>
                  </div>
                  {recentNotificationsList.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontStyle: 'italic', margin: 0 }}>No alerts found.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {recentNotificationsList.map((notif) => (
                        <div key={notif._id} style={{ fontSize: '0.78rem', padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                          <strong>{notif.title}</strong>
                          <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>{notif.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        );
      }

      case 'profile':
        return (
          <form onSubmit={handleUpdateProfile} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Company Profile Settings
            </h3>

            {saveSuccess && (
              <div style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {/* Account Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Account Representative Name</label>
                <input type="text" className="form-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input type="text" className="form-input" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://..." />
              </div>
            </div>

            {/* Company Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" className="form-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Industry Sector</label>
                <input type="text" className="form-input" value={brandIndustry} onChange={(e) => setBrandIndustry(e.target.value)} placeholder="Tech, Fashion, Food, etc." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input type="url" className="form-input" value={brandWebsite} onChange={(e) => setBrandWebsite(e.target.value)} placeholder="https://example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Representative Password (blank to keep current)</label>
                <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Company Description</label>
              <textarea rows="4" className="form-input" value={brandDescription} onChange={(e) => setBrandDescription(e.target.value)} placeholder="Summarize your company's focus and core target audience..." />
            </div>

            {/* Social Handles */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>Social Accounts Links</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Instagram Handle</label>
                <input type="text" className="form-input" value={brandInsta} onChange={(e) => setBrandInsta(e.target.value)} placeholder="@handle" />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter/X Handle</label>
                <input type="text" className="form-input" value={brandTwitter} onChange={(e) => setBrandTwitter(e.target.value)} placeholder="@handle" />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">LinkedIn Company Handle</label>
                <input type="text" className="form-input" value={brandLinkedin} onChange={(e) => setBrandLinkedin(e.target.value)} placeholder="company-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Facebook Profile URL Handle</label>
                <input type="text" className="form-input" value={brandFacebook} onChange={(e) => setBrandFacebook(e.target.value)} placeholder="page-handle" />
              </div>
            </div>

            {/* Showcase gallery */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', marginTop: '32px' }}>Company Portfolio Media</h4>
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Gallery Showcase Images (comma separated URLs)</label>
              <textarea rows="2" className="form-input" value={brandImages} onChange={(e) => setBrandImages(e.target.value)} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Save size={18} />
              Save Company Profile
            </button>
          </form>
        );

      case 'create':
        return (
          <form onSubmit={handleCreateCampaign} className="glass-panel animate-fade-in-up" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{editingCampaignId ? 'Edit Campaign Opportunity' : 'Post Campaign Opportunity Brief'}</span>
              {editingCampaignId && (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={() => {
                    setEditingCampaignId(null);
                    setTitle('');
                    setDescription('');
                    setBudgetMin('');
                    setBudgetMax('');
                    setNicheInput('');
                    setPlatformsInput('');
                    setDeliverablesInput('');
                    setCreatorsRequiredInput(1);
                    setDeadlineInput('');
                    setLocationInput('');
                    setRequirementsInput('');
                    setIsRemoteInput(true);
                    setProductName('');
                    setPaymentPerCreator('');
                    setMinFollowers('');
                    setMinEngagementRate('');
                    setPreferredCreatorCategory('');
                    setCampaignLanguage('');
                    setAppDeadline('');
                    setStartDate('');
                    setEndDate('');
                    setSubmissionDeadline('');
                    setProductImages('');
                    setBrandGuidelines('');
                    setCampaignStatus('active');
                    setSearchParams({ tab: 'campaigns' });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </h3>

            {saveSuccess && (
              <div style={{ color: 'var(--success)', background: 'var(--success-glow)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span>Campaign brief processed successfully!</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Campaign Title</label>
                <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Sponsorship for Fitness Influencers" required />
              </div>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-input" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. HydroFlask Neon Edition" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Campaign Description</label>
              <textarea rows="4" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide detailed guidelines about the campaign opportunity..." required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Target Platforms (comma separated)</label>
                <input type="text" className="form-input" value={platformsInput} onChange={(e) => setPlatformsInput(e.target.value)} placeholder="Instagram, YouTube, TikTok" required />
              </div>
              <div className="form-group">
                <label className="form-label">Niche/Category (comma separated)</label>
                <input type="text" className="form-input" value={nicheInput} onChange={(e) => setNicheInput(e.target.value)} placeholder="Fitness, Technology, Lifestyle" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Min Budget ($)</label>
                <input type="number" className="form-input" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="500" required />
              </div>
              <div className="form-group">
                <label className="form-label">Max Budget ($)</label>
                <input type="number" className="form-input" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="2500" required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Per Creator ($)</label>
                <input type="number" className="form-input" value={paymentPerCreator} onChange={(e) => setPaymentPerCreator(e.target.value)} placeholder="300" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Number of Creators Required</label>
                <input type="number" className="form-input" value={creatorsRequiredInput} onChange={(e) => setCreatorsRequiredInput(e.target.value)} placeholder="3" min="1" required />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Creator Niche/Category</label>
                <input type="text" className="form-input" value={preferredCreatorCategory} onChange={(e) => setPreferredCreatorCategory(e.target.value)} placeholder="e.g. Micro-influencer, Tech Geek" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Language</label>
                <input type="text" className="form-input" value={campaignLanguage} onChange={(e) => setCampaignLanguage(e.target.value)} placeholder="e.g. English, Spanish" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Minimum Followers Required</label>
                <input type="number" className="form-input" value={minFollowers} onChange={(e) => setMinFollowers(e.target.value)} placeholder="10000" />
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Engagement Rate (%)</label>
                <input type="number" step="0.1" className="form-input" value={minEngagementRate} onChange={(e) => setMinEngagementRate(e.target.value)} placeholder="3.5" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Target Location / Country</label>
                <input type="text" className="form-input" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder="United States, Worldwide" />
              </div>
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input type="date" className="form-input" value={appDeadline} onChange={(e) => setAppDeadline(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Campaign Start Date</label>
                <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Campaign End Date</label>
                <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Submission Deadline</label>
                <input type="date" className="form-input" value={submissionDeadline} onChange={(e) => setSubmissionDeadline(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Deliverables List (comma separated)</label>
                <input type="text" className="form-input" value={deliverablesInput} onChange={(e) => setDeliverablesInput(e.target.value)} placeholder="1 Video Post, 2 Stories, 1 Link in Bio" required />
              </div>
              <div className="form-group">
                <label className="form-label">Additional Requirements (comma separated)</label>
                <input type="text" className="form-input" value={requirementsInput} onChange={(e) => setRequirementsInput(e.target.value)} placeholder="Active engagement rate > 3%" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Product Image Links (comma separated URLs)</label>
              <textarea rows="2" className="form-input" value={productImages} onChange={(e) => setProductImages(e.target.value)} placeholder="https://example.com/prod1.jpg, https://example.com/prod2.jpg" />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Brand Guidelines / Instructions</label>
              <textarea rows="3" className="form-input" value={brandGuidelines} onChange={(e) => setBrandGuidelines(e.target.value)} placeholder="Describe styling rules, taglines, dos and don'ts..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                  <input type="checkbox" checked={isRemoteInput} onChange={(e) => setIsRemoteInput(e.target.checked)} style={{ width: '18px', height: '18px', margin: 0 }} />
                  <span>Remote Collaboration Campaign Opportunity</span>
                </label>
              </div>
              
              {editingCampaignId && (
                <div className="form-group">
                  <label className="form-label">Campaign Status</label>
                  <select className="form-input" value={campaignStatus} onChange={(e) => setCampaignStatus(e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active (Published)</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed (Closed)</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              {editingCampaignId ? (
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'center' }} disabled={creating}>
                  <Save size={18} />
                  {creating ? 'Saving Changes...' : 'Save All Changes'}
                </button>
              ) : (
                <>
                  <button type="button" onClick={(e) => handleCreateOrUpdate(e, 'active')} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'center' }} disabled={creating}>
                    <Send size={18} />
                    {creating ? 'Publishing...' : 'Publish Campaign'}
                  </button>
                  <button type="button" onClick={(e) => handleCreateOrUpdate(e, 'draft')} className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'center' }} disabled={creating}>
                    <FileText size={18} />
                    {creating ? 'Saving...' : 'Save as Draft'}
                  </button>
                </>
              )}
            </div>
          </form>
        );

      case 'campaigns':
        return (
          <div className="animate-fade-in-up">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>My Sponsorship Campaigns</h3>
            <div className="grid-container" style={{ gridTemplateColumns: inspectedCampaign ? '1fr 1.2fr' : '1fr', gap: '32px' }}>
              
              {/* Left Column: list of campaigns posted */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {campaigns.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No campaign briefs posted yet.</p>
                ) : (
                  campaigns.map((camp) => {
                    const isSelected = inspectedCampaign?._id === camp._id;
                    return (
                      <div
                        key={camp._id}
                        className="glass-panel"
                        style={{
                          padding: '20px',
                          cursor: 'pointer',
                          borderLeft: isSelected ? '4px solid var(--primary)' : '1px solid var(--border-color)',
                          background: isSelected ? 'var(--primary-glow)' : 'var(--bg-panel)'
                        }}
                        onClick={() => inspectCampaignApplicants(camp)}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h4 style={{ fontWeight: 800, margin: 0 }}>{camp.title}</h4>
                          {getStatusBadge(camp.status)}
                        </div>
                        <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span>Budget: <strong>${camp.budget?.min} - ${camp.budget?.max}</strong></span>
                          <span>Hires Required: <strong>{camp.creatorsRequired || 1}</strong></span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                          <button
                            className="btn btn-outline"
                            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              inspectCampaignApplicants(camp);
                            }}
                          >
                            View Incoming Pitches
                          </button>
                          
                          <div className="d-flex gap-2 align-items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditCampaign(camp);
                              }}
                              className="btn btn-icon"
                              style={{ color: 'var(--secondary)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                              title="Edit Campaign"
                            >
                              <EditIcon size={14} />
                            </button>

                            {camp.status === 'draft' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatusOnly(camp._id, 'active');
                                }}
                                className="btn btn-icon"
                                style={{ color: 'var(--success)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                title="Publish Campaign"
                              >
                                <Send size={14} />
                              </button>
                            )}

                            {camp.status === 'active' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusOnly(camp._id, 'paused');
                                  }}
                                  className="btn btn-icon"
                                  style={{ color: 'var(--warning)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                  title="Pause Campaign"
                                >
                                  <Pause size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusOnly(camp._id, 'completed');
                                  }}
                                  className="btn btn-icon"
                                  style={{ color: 'var(--danger)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                  title="Close Campaign"
                                >
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}

                            {camp.status === 'paused' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusOnly(camp._id, 'active');
                                  }}
                                  className="btn btn-icon"
                                  style={{ color: 'var(--success)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                  title="Resume Campaign"
                                >
                                  <Play size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusOnly(camp._id, 'completed');
                                  }}
                                  className="btn btn-icon"
                                  style={{ color: 'var(--danger)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                  title="Close Campaign"
                                >
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}

                            {(camp.status === 'draft' || camp.status === 'completed') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCampaignOnly(camp._id);
                                }}
                                className="btn btn-icon"
                                style={{ color: 'var(--danger)', border: '1px solid var(--border-color)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
                                title="Delete Campaign"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: inspected campaign applicants */}
              {inspectedCampaign && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h4 style={{ fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={20} style={{ color: 'var(--primary)' }} />
                    Applicants for: {inspectedCampaign.title}
                  </h4>
                  
                  {campaignApplicants.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: '20px 0 0 0' }}>No creators have applied to this brief yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {campaignApplicants.map((app) => {
                        const creator = app.creatorId || {};
                        const profile = creator.creatorProfile || {};
                        const matchScore = calculateMatchScore(inspectedCampaign, profile);
                        const rating = app.creatorRating || 5.0;
                        const previousCollaborations = app.previousCollaborationsCount || 0;

                        return (
                          <div key={app._id} className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                              <div className="d-flex align-items-center gap-3">
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', border: '2px solid var(--primary-glow)' }}>
                                  {creator.profileImage ? (
                                    <img src={creator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                  ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>C</div>
                                  )}
                                </div>
                                <div>
                                  <div className="d-flex align-items-center gap-2">
                                    <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{creator.name}</h5>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                      ★ {rating}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>
                                    Category: <strong>{profile.category || 'Influencer'}</strong>
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <span className={`badge badge-${app.status}`} style={{ textTransform: 'capitalize' }}>
                                {app.status}
                              </span>
                            </div>

                            {/* Creator Statistics & Matching Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', padding: '12px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Reach Reach:</span> <strong style={{ color: 'var(--text-main)' }}>{profile.followersCount?.toLocaleString() || 'N/A'}</strong>
                              </div>
                              <div style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Engagement Rate:</span> <strong style={{ color: 'var(--text-main)' }}>{profile.avgEngagement ? profile.avgEngagement + '%' : 'N/A'}</strong>
                              </div>
                              <div style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Primary Channel:</span> <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{profile.primaryPlatform || 'N/A'}</strong>
                              </div>
                              <div style={{ fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Past Collaborations:</span> <strong style={{ color: 'var(--success)' }}>{previousCollaborations} Completed</strong>
                              </div>
                              <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Campaign Match Score:</span>
                                <span className="badge" style={{ background: matchScore >= 80 ? 'var(--success-glow)' : 'var(--primary-glow)', color: matchScore >= 80 ? 'var(--success)' : 'var(--primary)', fontWeight: 800 }}>
                                  {matchScore}% Match
                                </span>
                              </div>
                            </div>

                            {/* Pitch proposal brief text */}
                            <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-panel)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', letterSpacing: '0.05em' }}>PITCH BRIEF PROPOSAL</span>
                              "{app.pitch}"
                            </div>

                            <div style={{ display: 'flex', justifycontent: 'space-between', alignitems: 'center', marginTop: '14px', fontSize: '0.82rem' }}>
                              <span>Proposed Compensation: <strong style={{ color: 'var(--success)', fontSize: '0.95rem' }}>${app.proposedRate}</strong></span>
                            </div>

                            {/* Action Buttons list */}
                            <div className="d-flex flex-wrap gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                              <Link
                                to={`/creators/${creator._id}`}
                                target="_blank"
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Eye size={12} /> View Profile
                              </Link>
                              
                              <button
                                onClick={() => handleStartMessagingCreator(creator._id, inspectedCampaign._id, creator.name)}
                                className="btn btn-outline"
                                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <MessageSquare size={12} /> Message Creator
                              </button>

                              {(app.status === 'pending' || app.status === 'shortlisted') && (
                                <>
                                  <button
                                    onClick={() => handleApplicationStatus(app._id, 'approved')}
                                    className="btn btn-primary"
                                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                  >
                                    Accept
                                  </button>
                                  
                                  {app.status === 'pending' && (
                                    <button
                                      onClick={() => handleApplicationStatus(app._id, 'shortlisted')}
                                      className="btn btn-outline"
                                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                                    >
                                      Shortlist
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleApplicationStatus(app._id, 'rejected')}
                                    className="btn btn-outline"
                                    style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {/* Invite to Another Campaign dropdown */}
                              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const selectedCamp = campaigns.find(c => c._id === e.target.value);
                                      if (selectedCamp) {
                                        handleInviteToAnotherCampaign(creator._id, selectedCamp._id, selectedCamp.title);
                                      }
                                      e.target.value = ''; // Reset select dropdown
                                    }
                                  }}
                                  className="form-input"
                                  style={{ fontSize: '0.78rem', padding: '6px 12px', width: 'auto', marginBottom: 0 }}
                                >
                                  <option value="">Invite to Campaign...</option>
                                  {campaigns
                                    .filter(c => c._id !== inspectedCampaign._id)
                                    .map(c => (
                                      <option key={c._id} value={c._id}>{c.title}</option>
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'applications': {
        const appFilterTabs = [
          { key: 'all', label: 'All Applications' },
          { key: 'pending', label: 'Pending' },
          { key: 'shortlisted', label: 'Shortlisted' },
          { key: 'approved', label: 'Accepted' },
          { key: 'rejected', label: 'Rejected' }
        ];

        const filteredApplications = appSubTab === 'all'
          ? applications
          : applications.filter(a => a.status === appSubTab);

        const pendingCount = applications.filter(a => a.status === 'pending').length;
        const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
        const approvedCount = applications.filter(a => a.status === 'approved').length;
        const rejectedCount = applications.filter(a => a.status === 'rejected').length;

        return (
          <div className="animate-fade-in-up">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Applications Received</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  Manage all creator applications across your campaigns.
                </p>
              </div>
              <button
                onClick={() => setSearchParams({ tab: 'campaigns' })}
                className="btn btn-outline"
                style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Briefcase size={14} /> View My Campaigns
              </button>
            </div>

            {/* Summary Stats Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{applications.length}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL RECEIVED</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)' }}>{pendingCount}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PENDING REVIEW</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{approvedCount}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ACCEPTED</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d63384' }}>{shortlistedCount}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SHORTLISTED</span>
                </div>
              </div>
            </div>

            {/* Filter Sub-Tabs */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {appFilterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAppSubTab(tab.key)}
                  className="btn"
                  style={{
                    padding: '6px 16px',
                    fontSize: '0.82rem',
                    background: appSubTab === tab.key ? 'var(--primary-gradient)' : 'var(--bg-tertiary)',
                    color: appSubTab === tab.key ? '#fff' : 'var(--text-secondary)',
                    border: appSubTab === tab.key ? 'none' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: appSubTab === tab.key ? 700 : 400
                  }}
                >
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span style={{
                      marginLeft: '6px',
                      padding: '1px 7px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      background: appSubTab === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--bg-secondary)',
                      color: appSubTab === tab.key ? '#fff' : 'var(--text-muted)',
                      fontWeight: 700
                    }}>
                      {tab.key === 'pending' ? pendingCount : tab.key === 'shortlisted' ? shortlistedCount : tab.key === 'approved' ? approvedCount : rejectedCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
                <h4 style={{ fontWeight: 700, margin: '0 0 8px 0' }}>No applications found</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                  {appSubTab === 'all'
                    ? 'No creators have applied to your campaigns yet. Publish more campaigns to attract applications.'
                    : `No ${appSubTab} applications at this time.`}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredApplications.map((app) => {
                  const creator = app.creatorId || {};
                  const profile = creator.creatorProfile || {};
                  const matchScore = calculateMatchScore(app.projectId, profile);
                  const rating = app.creatorRating || 5.0;
                  const previousCollaborations = app.previousCollaborationsCount || 0;

                  return (
                    <div key={app._id} className="glass-panel" style={{ padding: '24px' }}>
                      
                      {/* Application Campaign Badge */}
                      {app.projectId?.title && (
                        <div style={{ marginBottom: '16px', padding: '6px 14px', background: 'var(--primary-glow)', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Briefcase size={12} style={{ color: 'var(--primary)' }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {app.projectId?.title}
                          </span>
                        </div>
                      )}

                      {/* Creator Header */}
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-3">
                          {/* Creator Photo */}
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: 'var(--bg-tertiary)',
                            overflow: 'hidden',
                            border: '2px solid var(--primary-glow)',
                            flexShrink: 0
                          }}>
                            {creator.profileImage ? (
                              <img src={creator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={creator.name} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', background: 'var(--primary-gradient)', color: '#fff' }}>
                                {creator.name?.charAt(0)?.toUpperCase() || 'C'}
                              </div>
                            )}
                          </div>

                          {/* Creator Name, Rating, Category */}
                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <h5 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>{creator.name || 'Creator'}</h5>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span key={star} style={{ color: star <= Math.round(rating) ? 'var(--warning)' : 'var(--border-color)', fontSize: '0.85rem' }}>★</span>
                                ))}
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{rating}</span>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-wrap mt-1">
                              <span style={{ fontSize: '0.78rem', padding: '2px 10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                                {profile.category || 'Influencer'}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Applied: {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="d-flex flex-column align-items-end gap-2">
                          <span className={`badge badge-${app.status}`} style={{ textTransform: 'capitalize', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
                            {app.status === 'approved' ? '✓ Accepted' : app.status === 'rejected' ? '✗ Rejected' : app.status === 'shortlisted' ? '⭐ Shortlisted' : '⏳ Pending'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {new Date(app.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Creator Stats Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '12px',
                        marginTop: '20px',
                        padding: '16px',
                        background: 'var(--bg-panel)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {profile.followersCount
                              ? profile.followersCount >= 1000000
                                ? (profile.followersCount / 1000000).toFixed(1) + 'M'
                                : profile.followersCount >= 1000
                                  ? (profile.followersCount / 1000).toFixed(1) + 'K'
                                  : profile.followersCount
                              : 'N/A'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>FOLLOWERS</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>
                            {profile.avgEngagement ? profile.avgEngagement + '%' : 'N/A'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>ENGAGEMENT</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'capitalize' }}>
                            {profile.primaryPlatform || 'N/A'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>PLATFORM</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d63384' }}>{previousCollaborations}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>PREV COLLABS</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <span style={{
                              fontSize: '1.1rem', fontWeight: 800,
                              color: matchScore >= 80 ? 'var(--success)' : matchScore >= 60 ? 'var(--warning)' : 'var(--danger)'
                            }}>
                              {matchScore}%
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>MATCH SCORE</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--warning)' }}>${app.proposedRate || 'N/A'}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>PROPOSED RATE</div>
                        </div>
                      </div>

                      {/* Match Score Progress Bar */}
                      <div style={{ marginTop: '12px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Campaign Match Score</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: matchScore >= 80 ? 'var(--success)' : matchScore >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
                            {matchScore}%
                          </span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${matchScore}%`,
                            background: matchScore >= 80 ? 'var(--success)' : matchScore >= 60 ? 'var(--warning)' : 'var(--danger)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>

                      {/* Pitch Proposal */}
                      <div style={{ marginTop: '16px', background: 'var(--bg-panel)', borderLeft: '3px solid var(--primary)', padding: '12px 16px', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>PITCH PROPOSAL</span>
                        <p style={{ margin: 0, fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontStyle: 'italic' }}>
                          "{app.pitch || 'No pitch message provided.'}"
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex flex-wrap gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                        {/* View Profile */}
                        <Link
                          to={`/creators/${creator._id}`}
                          target="_blank"
                          className="btn btn-outline"
                          style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Eye size={14} /> View Profile
                        </Link>

                        {/* Message Creator */}
                        <button
                          onClick={() => handleStartMessagingCreator(creator._id, app.projectId?._id || app.projectId, creator.name)}
                          className="btn btn-outline"
                          style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <MessageSquare size={14} /> Message Creator
                        </button>

                        {/* Status Action Buttons - only show if not yet finalized */}
                        {app.status !== 'approved' && app.status !== 'rejected' && (
                          <>
                            <button
                              onClick={() => handleApplicationStatus(app._id, 'approved')}
                              className="btn btn-primary"
                              style={{ padding: '7px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                              <CheckCircle2 size={14} /> Accept
                            </button>

                            {app.status !== 'shortlisted' && (
                              <button
                                onClick={() => handleApplicationStatus(app._id, 'shortlisted')}
                                className="btn btn-outline"
                                style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', color: '#d63384', borderColor: 'rgba(168, 85, 247, 0.3)' }}
                              >
                                <Bookmark size={14} /> Shortlist
                              </button>
                            )}

                            <button
                              onClick={() => handleApplicationStatus(app._id, 'rejected')}
                              className="btn btn-outline"
                              style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        )}

                        {/* Re-evaluate if already accepted/rejected */}
                        {(app.status === 'approved' || app.status === 'rejected') && (
                          <button
                            onClick={() => handleApplicationStatus(app._id, 'pending')}
                            className="btn btn-outline"
                            style={{ padding: '7px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                          >
                            <Clock size={14} /> Move to Pending
                          </button>
                        )}

                        {/* Invite to Another Campaign Dropdown */}
                        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                const selectedCamp = campaigns.find(c => c._id === e.target.value);
                                if (selectedCamp) {
                                  handleInviteToAnotherCampaign(creator._id, selectedCamp._id, selectedCamp.title);
                                }
                                e.target.value = '';
                              }
                            }}
                            className="form-input"
                            style={{
                              fontSize: '0.78rem',
                              padding: '7px 14px',
                              width: 'auto',
                              marginBottom: 0,
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-tertiary)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <option value="">📨 Invite to Campaign...</option>
                            {campaigns
                              .filter(c => {
                                const appProjectId = typeof app.projectId === 'object' ? app.projectId?._id : app.projectId;
                                return c._id !== appProjectId;
                              })
                              .map(c => (
                                <option key={c._id} value={c._id}>{c.title}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'collaborations':
      case 'active-collaborations': {
        const activeWS = workspaces.filter(ws => ws.status === 'active');
        const completedWS = workspaces.filter(ws => ws.status === 'completed');
        const filteredWorkspaces = collabSubTab === 'completed'
          ? completedWS
          : (collabSubTab === 'active' ? activeWS : workspaces);

        return (
          <div className="animate-fade-in-up">
            {/* Header & Sub-tabs */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Company Collaborations</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  Manage accepted creator collaborations, review content submissions, approve deliverables, and release payments.
                </p>
              </div>
              <div className="d-flex gap-2">
                {['all', 'active', 'completed'].map(tabKey => (
                  <button
                    key={tabKey}
                    onClick={() => setCollabSubTab(tabKey)}
                    className="btn"
                    style={{
                      padding: '6px 16px',
                      fontSize: '0.82rem',
                      background: collabSubTab === tabKey ? 'var(--primary-gradient)' : 'var(--bg-tertiary)',
                      color: collabSubTab === tabKey ? '#fff' : 'var(--text-secondary)',
                      border: collabSubTab === tabKey ? 'none' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: collabSubTab === tabKey ? 700 : 400,
                      textTransform: 'capitalize'
                    }}
                  >
                    {tabKey} ({tabKey === 'all' ? workspaces.length : (tabKey === 'active' ? activeWS.length : completedWS.length)})
                  </button>
                ))}
              </div>
            </div>

            {filteredWorkspaces.length === 0 ? (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
                <Briefcase size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
                <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>No collaborations found</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Accept applications from the "Applications Received" tab to start collaborations with creators.
                </p>
                <button onClick={() => setSearchParams({ tab: 'applications' })} className="btn btn-primary" style={{ marginTop: '16px' }}>
                  View Received Applications
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {filteredWorkspaces.map((ws) => {
                  const creator = ws.creatorId || {};
                  const project = ws.projectId || {};
                  const totalMilestones = ws.milestones?.length || 0;
                  const approvedMilestones = ws.milestones?.filter(m => m.status === 'approved').length || 0;
                  const progressPct = totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;
                  const formattedDeadline = project.deadline 
                    ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';
                  const rateAmount = ws.agreedRate || project.budget?.max || ws.proposedRate || 1000;
                  const isPaid = ws.paymentStatus === 'paid' || ws.paymentStatus === 'released';

                  return (
                    <div key={ws._id} className="glass-panel" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
                      {/* Top Header Card */}
                      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', border: '2px solid var(--primary-glow)' }}>
                            {creator.profileImage ? (
                              <img src={creator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={creator.name} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, background: 'var(--primary-gradient)', color: '#fff', fontSize: '1.2rem' }}>
                                {creator.name?.charAt(0)?.toUpperCase() || 'C'}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>{creator.name}</h4>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({creator.email})</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                              Campaign Name: <strong>{project.title || 'Sponsorship Contract'}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="d-flex flex-column align-items-end gap-2">
                          <div className="d-flex gap-2">
                            <span className={`badge badge-${ws.status === 'completed' ? 'approved' : 'primary'}`} style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                              Status: {ws.status?.toUpperCase()}
                            </span>
                            <span className={`badge badge-${isPaid ? 'approved' : 'pending'}`} style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                              Payment: {isPaid ? 'PAID & RELEASED' : 'IN ESCROW'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--success)' }}>
                            Contract Rate: ${rateAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Campaign Brief */}
                      <div className="mb-4">
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>CAMPAIGN BRIEF</span>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                          {project.description || 'Campaign specifications provided to creator.'}
                        </p>
                      </div>

                      {/* Deliverables Overview */}
                      {project.deliverables && project.deliverables.length > 0 && (
                        <div className="mb-4">
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '6px' }}>REQUIRED DELIVERABLES</span>
                          <div className="d-flex flex-wrap gap-2">
                            {project.deliverables.map((deliv, dIdx) => (
                              <span key={dIdx} className="badge badge-outline" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '6px 12px' }}>
                                ✓ {deliv}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Progress Bar & Deadline */}
                      <div className="row g-3 mb-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <div className="col-12 col-md-6">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>COLLABORATION PROGRESS</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>{progressPct}% ({approvedMilestones}/{totalMilestones} Approved)</span>
                          </div>
                          <div className="progress" style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${progressPct}%`, background: 'var(--primary-gradient)', borderRadius: 'var(--radius-full)' }}
                            ></div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 text-md-end">
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, letterSpacing: '0.05em' }}>CAMPAIGN SUBMISSION DEADLINE</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ec4899' }}>{formattedDeadline}</span>
                        </div>
                      </div>

                      {/* Timeline & Milestones Review */}
                      <div className="mb-4">
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '14px' }}>DELIVERABLES & SUBMISSION TIMELINE</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {ws.milestones?.map((m) => {
                            let mBadge = 'badge-pending';
                            let mLabel = 'Pending Submission';
                            if (m.status === 'approved') { mBadge = 'badge-approved'; mLabel = 'Approved'; }
                            else if (m.status === 'submitted') { mBadge = 'badge-shortlisted'; mLabel = 'Submitted - Needs Review'; }
                            else if (m.status === 'changes_requested') { mBadge = 'badge-rejected'; mLabel = 'Changes Requested'; }

                            return (
                              <div key={m._id} style={{ background: 'var(--bg-panel)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                                  <h5 style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0 }}>{m.title}</h5>
                                  <span className={`badge ${mBadge}`} style={{ fontSize: '0.72rem' }}>{mLabel}</span>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{m.description}</p>

                                {/* Uploaded Content proof output link */}
                                {m.submissionUrl && (
                                  <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '0.82rem', border: '1px solid var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 700, marginBottom: '4px' }}>UPLOADED CONTENT PROOF:</span>
                                    <a href={m.submissionUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                                      <LinkIcon size={14} /> {m.submissionUrl} <ExternalLink size={12} />
                                    </a>
                                    {m.submissionNotes && (
                                      <p style={{ color: 'var(--text-secondary)', marginTop: '6px', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                                        Notes from creator: "{m.submissionNotes}"
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* Change Request Feedback Notes if present */}
                                {m.status === 'changes_requested' && m.feedbackNotes && (
                                  <div style={{ background: 'rgba(239,68,68,0.1)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)' }}>
                                    <strong>Your Revision Request:</strong> "{m.feedbackNotes}"
                                  </div>
                                )}

                                {/* Deliverable Action Buttons */}
                                {m.status === 'submitted' && (
                                  <div className="d-flex gap-2 mt-2 flex-wrap">
                                    <button
                                      onClick={() => handleApproveSubmission(ws._id, m._id)}
                                      className="btn btn-primary"
                                      style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                      <CheckCircle size={14} /> Approve Submission
                                    </button>

                                    <button
                                      onClick={() => setChangeRequestModal({ wsId: ws._id, mId: m._id, title: m.title, feedbackNotes: '' })}
                                      className="btn btn-outline"
                                      style={{ padding: '6px 14px', fontSize: '0.78rem', color: 'var(--warning)', borderColor: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                      <RefreshCw size={14} /> Request Changes
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Overall Company Actions Footer Bar */}
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/creators/${creator._id}`}
                            className="btn btn-outline"
                            style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Eye size={14} /> View Creator Profile
                          </Link>

                          <button
                            onClick={() => handleStartMessagingCreator(creator._id, project._id, creator.name)}
                            className="btn btn-outline"
                            style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <MessageSquare size={14} /> Message Creator
                          </button>
                        </div>

                        <div className="d-flex gap-2">
                          {!isPaid && (
                            <button
                              onClick={() => handleMarkPaymentPaid(ws._id)}
                              className="btn btn-outline"
                              style={{ padding: '8px 16px', fontSize: '0.82rem', color: 'var(--success)', borderColor: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <CreditCard size={14} /> Mark Payment Paid (${rateAmount.toLocaleString()})
                            </button>
                          )}

                          {ws.status !== 'completed' && (
                            <button
                              onClick={() => handleMarkWorkspaceCompleted(ws._id)}
                              className="btn btn-primary"
                              style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <CheckSquare size={14} /> Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'shortlist': {

        const shortlistedPitches = applications.filter(a => a.status === 'shortlisted');
        return (
          <div className="animate-fade-in-up" style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Shortlisted Creators</h3>
            
            {shortlistedPitches.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No creators have been shortlisted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {shortlistedPitches.map((app) => {
                  const creator = app.creatorId || {};
                  const profile = creator.creatorProfile || {};
                  const matchScore = calculateMatchScore(app.projectId, profile);
                  const rating = app.creatorRating || 5.0;
                  const previousCollaborations = app.previousCollaborationsCount || 0;

                  return (
                    <div key={app._id} className="glass-panel" style={{ padding: '20px' }}>
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', border: '2px solid var(--primary-glow)' }}>
                            {creator.profileImage ? (
                              <img src={creator.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>C</div>
                            )}
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <h5 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>{creator.name}</h5>
                              <span style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>★ {rating}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Campaign: <strong>{app.projectId?.title || 'Direct collaboration'}</strong></span>
                          </div>
                        </div>
                        <span className="badge badge-shortlisted">Shortlisted</span>
                      </div>

                      {/* Creator Statistics & Matching Info */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', padding: '12px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Reach Reach:</span> <strong style={{ color: 'var(--text-main)' }}>{profile.followersCount?.toLocaleString() || 'N/A'}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Engagement Rate:</span> <strong style={{ color: 'var(--text-main)' }}>{profile.avgEngagement ? profile.avgEngagement + '%' : 'N/A'}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Primary Channel:</span> <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{profile.primaryPlatform || 'N/A'}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Past Collaborations:</span> <strong style={{ color: 'var(--success)' }}>{previousCollaborations} Completed</strong>
                        </div>
                        <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Campaign Match Score:</span>
                          <span className="badge badge-primary" style={{ fontWeight: 800 }}>
                            {matchScore}% Match
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginTop: '12px', borderLeft: '3px solid var(--primary)' }}>
                        "{app.pitch}"
                      </p>

                      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2" style={{ fontSize: '0.8rem' }}>
                        <span>Proposed Rate: <strong style={{ color: 'var(--success)', fontSize: '0.9rem' }}>${app.proposedRate}</strong></span>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/creators/${creator._id}`}
                            target="_blank"
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} /> View Profile
                          </Link>
                          
                          <button
                            onClick={() => handleStartMessagingCreator(creator._id, app.projectId?._id, creator.name)}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <MessageSquare size={12} /> Message Creator
                          </button>

                          <button onClick={() => handleApplicationStatus(app._id, 'approved')} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Accept</button>
                          <button onClick={() => handleApplicationStatus(app._id, 'rejected')} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }}>Reject</button>
                          
                          {/* Invite Dropdown */}
                          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const selectedCamp = campaigns.find(c => c._id === e.target.value);
                                  if (selectedCamp) {
                                    handleInviteToAnotherCampaign(creator._id, selectedCamp._id, selectedCamp.title);
                                  }
                                  e.target.value = '';
                                }
                              }}
                              className="form-input"
                              style={{ fontSize: '0.78rem', padding: '6px 12px', width: 'auto', marginBottom: 0 }}
                            >
                              <option value="">Invite to Campaign...</option>
                              {campaigns
                                .filter(c => c._id !== app.projectId?._id)
                                .map(c => (
                                  <option key={c._id} value={c._id}>{c.title}</option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'payments': {
        return (
          <div className="animate-fade-in-up" style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px' }}>Escrow Sponsorship Payments</h3>
            
            <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '20px', background: 'var(--primary-glow)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FUNDS SECURED IN ESCROW</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary)' }}>
                  ${workspaces.filter(w => w.status === 'active').reduce((acc, w) => acc + (w.proposedRate || 1000), 0).toLocaleString()}
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', background: 'var(--success-glow)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>TOTAL REVENUE RELEASED</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--success)' }}>
                  ${workspaces.filter(w => w.status === 'completed').reduce((acc, w) => acc + (w.proposedRate || 1000), 0).toLocaleString()}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Transaction History Log</h4>
            {workspaces.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No payout contracts found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {workspaces.map((w) => (
                  <div key={w._id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>Sponsorship for: {w.projectId?.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Partner Creator: {w.creatorId?.name} | Date: {new Date(w.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: w.status === 'completed' ? 'var(--success)' : 'var(--primary)' }}>${w.proposedRate || 1000}</div>
                      <span className={`badge badge-${w.status === 'completed' ? 'approved' : w.status}`} style={{ fontSize: '0.68rem', padding: '4px 8px', marginTop: '4px' }}>
                        {w.status === 'completed' ? 'Released' : 'In Escrow'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'notifications':
        return renderNotificationsLayout();

      case 'messages':
        return renderInboxLayout();

      case 'analytics':
        return renderAnalyticsLayout();

      case 'settings':
        return renderSettingsLayout();

      default:
        return <div>Tab not found.</div>;
    }
  };

  // REUSABLE NOTIFICATIONS LAYOUT
  const renderNotificationsLayout = () => {
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifs = notifications.filter(notif => {
      if (notifFilter === 'unread') return !notif.isRead;
      if (notifFilter === 'campaigns') return notif.type?.includes('application') || notif.type?.includes('invitation');
      if (notifFilter === 'payments') return notif.type?.includes('payment') || notif.type?.includes('milestone') || notif.type?.includes('submission');
      return true;
    });

    const getNotifIcon = (type) => {
      switch (type) {
        case 'new_application':
        case 'application_submitted':
          return <FileText size={20} style={{ color: 'var(--primary)' }} />;
        case 'invitation_accepted':
          return <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />;
        case 'invitation_rejected':
          return <XCircle size={20} style={{ color: 'var(--danger)' }} />;
        case 'submission_uploaded':
        case 'milestone_submitted':
          return <PlusCircle size={20} style={{ color: 'var(--primary)' }} />;
        case 'payment_completed':
        case 'payment_released':
          return <CreditCard size={20} style={{ color: 'var(--success)' }} />;
        case 'deadline_reminder':
          return <Clock size={20} style={{ color: 'var(--warning)' }} />;
        case 'campaign_completed':
        case 'workspace_completed':
          return <Sparkles size={20} style={{ color: 'var(--primary)' }} />;
        case 'milestone_changes_requested':
          return <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />;
        default:
          return <Bell size={20} style={{ color: 'var(--primary)' }} />;
      }
    };

    return (
      <div className="animate-fade-in-up" style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Notification Activity Center</h3>
              {unreadCount > 0 && (
                <span className="badge badge-primary" style={{ fontSize: '0.72rem', borderRadius: 'var(--radius-full)', padding: '4px 10px' }}>
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Real-time updates linked to campaign applications, creator invitations, content submissions, and payments.
            </p>
          </div>

          <div className="d-flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="btn btn-outline"
                style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={14} /> Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Sub-tabs */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          {[
            { key: 'all', label: `All (${notifications.length})` },
            { key: 'unread', label: `Unread (${unreadCount})` },
            { key: 'campaigns', label: 'Campaigns & Invitations' },
            { key: 'payments', label: 'Payments & Submissions' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setNotifFilter(tab.key)}
              className="btn"
              style={{
                padding: '6px 16px',
                fontSize: '0.8rem',
                background: notifFilter === tab.key ? 'var(--primary-gradient)' : 'var(--bg-tertiary)',
                color: notifFilter === tab.key ? '#fff' : 'var(--text-secondary)',
                border: notifFilter === tab.key ? 'none' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                fontWeight: notifFilter === tab.key ? 700 : 400
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications Feed List */}
        {filteredNotifs.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <Bell size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
            <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>No Notifications</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {notifFilter === 'unread' ? 'You have caught up on all recent notifications.' : 'Activity alerts regarding your campaigns will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredNotifs.map((notif) => {
              const projectTitle = typeof notif.projectId === 'object' ? notif.projectId?.title : null;
              const formattedDate = new Date(notif.createdAt).toLocaleString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <div
                  key={notif._id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    background: notif.isRead ? 'var(--bg-panel)' : 'rgba(255, 107, 107, 0.06)',
                    border: notif.isRead ? '1px solid var(--border-color)' : '1px solid var(--primary-glow)',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    {/* Icon Badge */}
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {getNotifIcon(notif.type)}
                    </div>

                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <h4 style={{ fontWeight: notif.isRead ? 700 : 800, fontSize: '0.98rem', margin: 0 }}>
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} />
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '4px 0 10px 0' }}>
                        {notif.body}
                      </p>

                      {/* Related Campaign Banner */}
                      {projectTitle && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          background: 'var(--bg-tertiary)', padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                          fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '12px'
                        }}>
                          🎯 Linked Campaign: {projectTitle}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <div className="d-flex gap-2">
                          {(notif.link || notif.projectId) && (
                            <Link
                              to={notif.link || `/campaigns/${typeof notif.projectId === 'object' ? notif.projectId?._id : notif.projectId}`}
                              className="btn btn-primary"
                              style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <ArrowUpRight size={14} /> View Related Campaign
                            </Link>
                          )}
                        </div>

                        <div className="d-flex gap-2">
                          {!notif.isRead && (
                            <button
                              onClick={() => handleMarkNotificationAsRead(notif._id)}
                              className="btn btn-outline"
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notif._id)}
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger-glow)' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // INBOX CHAT SYSTEM LAYOUT
  const renderInboxLayout = () => {
    const filteredThreads = inboxThreads.filter((thread) => {
      const q = threadSearch.toLowerCase();
      return (
        thread.partnerName?.toLowerCase().includes(q) ||
        thread.projectTitle?.toLowerCase().includes(q) ||
        thread.lastMessageText?.toLowerCase().includes(q)
      );
    });

    const filteredChatMessages = chatSearch.trim()
      ? chatMessages.filter(m => m.text?.toLowerCase().includes(chatSearch.toLowerCase()) || m.attachments?.some(a => a.toLowerCase().includes(chatSearch.toLowerCase())))
      : chatMessages;

    return (
      <div className="animate-fade-in-up chat-inbox-grid">
        
        {/* Inbox Left: Conversation threads list */}
        <div className="glass-panel inbox-left-pane" style={{ padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
              Conversations
            </h3>
            <span className="badge badge-primary" style={{ fontSize: '0.72rem', borderRadius: 'var(--radius-full)', padding: '4px 10px' }}>
              {inboxThreads.length} Thread{inboxThreads.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Thread Search Box */}
          <div className="form-group mb-3" style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search chats by name or campaign..."
              className="form-input"
              value={threadSearch}
              onChange={(e) => setThreadSearch(e.target.value)}
              style={{ fontSize: '0.82rem', paddingLeft: '36px', paddingRight: '28px', marginBottom: 0 }}
            />
            {threadSearch && (
              <button onClick={() => setThreadSearch('')} style={{ position: 'absolute', right: '10px', top: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                ✕
              </button>
            )}
          </div>

          {filteredThreads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
              <MessageSquare size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              <p style={{ fontSize: '0.85rem', margin: 0 }}>No matching conversations found.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredThreads.map((thread) => {
                const isUnread = thread.unreadCount > 0;
                const isSelected = activeThread?.projectId === thread.projectId;
                
                return (
                  <div
                    key={thread.projectId}
                    onClick={() => selectThread(thread)}
                    className={`glass-panel glass-panel-hover ${isSelected ? 'active-border' : ''}`}
                    style={{
                      padding: '14px',
                      cursor: 'pointer',
                      background: isSelected 
                        ? 'var(--bg-tertiary)' 
                        : (isUnread ? 'rgba(255, 107, 107, 0.08)' : 'transparent'),
                      border: isSelected 
                        ? '2px solid var(--primary)' 
                        : (isUnread ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)'),
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {/* Avatar with status indicator dot */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)' }}>
                          {thread.partnerAvatar ? <img src={thread.partnerAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : thread.partnerName?.substring(0, 2).toUpperCase()}
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg-primary)' }} title="Active Partner" />
                      </div>

                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: isUnread ? 900 : 800, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isUnread ? 'var(--primary)' : 'var(--text-main)' }}>
                            {thread.partnerName}
                          </span>
                          {isUnread && (
                            <span className="badge badge-primary" style={{ padding: '3px 8px', fontSize: '0.65rem', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                              {thread.unreadCount} New
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                          🎯 {thread.projectTitle}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <p style={{ fontSize: '0.78rem', color: isUnread ? 'var(--text-main)' : 'var(--text-secondary)', fontWeight: isUnread ? 700 : 400, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                            {thread.lastMessageText}
                          </p>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            {thread.lastMessageDate ? new Date(thread.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inbox Right: Active thread chat room */}
        <div className="glass-panel inbox-right-pane" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
          {activeThread ? (
            <>
              {/* Campaign-Based Header Banner */}
              <div style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 24px', background: 'var(--bg-panel)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <button 
                      onClick={() => setMobileShowChat(false)} 
                      className="btn btn-outline mobile-back-btn" 
                      style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ChevronLeft size={14} /> Back
                    </button>

                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--border-color)', overflow: 'hidden', border: '2px solid var(--primary-glow)', flexShrink: 0 }}>
                      {activeThread.partnerAvatar ? (
                        <img src={activeThread.partnerAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, background: 'var(--primary-gradient)', color: '#fff', fontSize: '0.9rem' }}>
                          {activeThread.partnerName?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h4 style={{ fontWeight: 800, margin: 0, fontSize: '1.05rem' }}>{activeThread.partnerName}</h4>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>● Active Now</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                        Campaign: <strong>{activeThread.projectTitle}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      onClick={() => setShowChatSearch(!showChatSearch)}
                      className="btn btn-outline"
                      style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Search in messages"
                    >
                      <Search size={14} /> Search
                    </button>

                    <Link
                      to={`/workspaces/${activeThread.workspaceId}`}
                      className="btn btn-outline"
                      style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Briefcase size={14} /> Open Workspace
                    </Link>
                  </div>
                </div>

                {/* Inline Message Search Bar */}
                {showChatSearch && (
                  <div style={{ marginTop: '12px', position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Filter messages in this conversation..."
                      className="form-input"
                      value={chatSearch}
                      onChange={e => setChatSearch(e.target.value)}
                      style={{ fontSize: '0.8rem', paddingLeft: '32px', paddingRight: '28px', marginBottom: 0 }}
                    />
                    {chatSearch && (
                      <button onClick={() => setChatSearch('')} style={{ position: 'absolute', right: '8px', top: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Message grid */}
              <div style={{ flexGrow: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)' }}>
                {filteredChatMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                    <MessageSquare size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>
                      {chatSearch ? 'No messages match your search filter.' : 'No messages in this chat thread yet. Send a greeting to get started!'}
                    </p>
                  </div>
                ) : (
                  filteredChatMessages.map((msg) => {
                    const isMe = msg.senderId === user._id;

                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          alignSelf: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {/* Bubble */}
                        <div
                          style={{
                            padding: '14px 18px',
                            borderRadius: '16px',
                            borderBottomRightRadius: isMe ? '4px' : '16px',
                            borderBottomLeftRadius: isMe ? '16px' : '4px',
                            background: isMe ? 'var(--primary-gradient)' : 'var(--bg-tertiary)',
                            color: '#fff',
                            border: isMe ? 'none' : '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-card)'
                          }}
                        >
                          {msg.text && (
                            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {msg.text}
                            </p>
                          )}
                          
                          {/* Attachments preview */}
                          {msg.attachments?.map((url, i) => {
                            const isImg = /\.(jpeg|jpg|gif|png|webp|svg)/i.test(url) || url.startsWith('data:image/');

                            if (isImg) {
                              return (
                                <div
                                  key={i}
                                  onClick={() => setLightboxImage(url)}
                                  style={{
                                    marginTop: msg.text ? '10px' : 0,
                                    maxWidth: '300px', borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer', position: 'relative'
                                  }}
                                  title="Click to expand full image"
                                >
                                  <img src={url} alt="Attachment" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '220px', objectFit: 'cover' }} />
                                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.68rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Eye size={12} /> Expand
                                  </div>
                                </div>
                              );
                            }

                            // Document / File attachment card
                            return (
                              <div
                                key={i}
                                style={{
                                  marginTop: msg.text ? '10px' : 0,
                                  display: 'flex', alignItems: 'center', gap: '10px',
                                  background: 'rgba(0,0,0,0.2)', padding: '10px 14px',
                                  borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.15)'
                                }}
                              >
                                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.65rem', flexShrink: 0 }}>
                                  FILE
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {url.split('/').pop() || 'Attachment Document'}
                                  </span>
                                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', fontSize: '0.72rem', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                    View / Download File <ArrowUpRight size={11} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Timestamp & Read Receipts */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && (
                            <span style={{ color: msg.read ? 'var(--success)' : 'var(--text-muted)', fontWeight: 800 }} title={msg.read ? 'Seen by partner' : 'Sent'}>
                              {msg.read ? '✓✓ Read' : '✓ Sent'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                
                {/* Typing Indicator */}
                {partnerTyping && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', alignSelf: 'flex-start', background: 'var(--bg-tertiary)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'bounce 1s infinite alternate' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'bounce 1s infinite alternate 0.2s' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'bounce 1s infinite alternate 0.4s' }}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>partner is typing...</span>
                  </div>
                )}
              </div>

              {/* Chat Input form bar & Media Share Drawer */}
              <div style={{ borderTop: '1px solid var(--border-color)', padding: '16px 20px', background: 'var(--bg-panel)' }}>

                {/* Media Share Drawer (Image or File input) */}
                {mediaDrawer && (
                  <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {mediaDrawer === 'image' ? <Image size={15} /> : <Paperclip size={15} />}
                        Share {mediaDrawer === 'image' ? 'Image Attachment' : 'File / Document Attachment'}
                      </span>
                      <button onClick={() => { setMediaDrawer(null); setMediaUrlInput(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                    </div>
                    <div className="d-flex gap-2">
                      <input
                        type="url"
                        placeholder={mediaDrawer === 'image' ? 'Paste image URL (https://...)' : 'Paste file / document URL (https://...)'}
                        className="form-input"
                        value={mediaUrlInput}
                        onChange={e => setMediaUrlInput(e.target.value)}
                        style={{ fontSize: '0.82rem', marginBottom: 0, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (mediaUrlInput) {
                            setAttachUrl(mediaUrlInput);
                            setMediaDrawer(null);
                            setMediaUrlInput('');
                          }
                        }}
                        className="btn btn-primary"
                        style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      >
                        Attach
                      </button>
                    </div>
                  </div>
                )}

                {/* Optional attachments URL preview banner */}
                {attachUrl && (
                  <div style={{ padding: '8px 14px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '85%' }}>
                      📎 Attached: {attachUrl}
                    </span>
                    <button type="button" onClick={() => setAttachUrl('')} className="btn-icon" style={{ padding: '2px', color: 'var(--danger)' }}><Trash2 size={13} /></button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
                  <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="btn-icon" title="Emoji reactions"><Smile size={20} /></button>
                  <button type="button" onClick={() => setMediaDrawer(mediaDrawer === 'image' ? null : 'image')} className="btn-icon" title="Attach Image"><Image size={20} /></button>
                  <button type="button" onClick={() => setMediaDrawer(mediaDrawer === 'file' ? null : 'file')} className="btn-icon" title="Attach Document / File"><Paperclip size={20} /></button>
                  
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="form-input"
                    style={{ flexGrow: 1, marginBottom: 0 }}
                    value={typedMessage}
                    onChange={handleUserInputChange}
                  />
                  
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={16} /> Send
                  </button>

                  {/* Emoji selection dropdown popup */}
                  {showEmojiPicker && (
                    <div className="glass-panel" style={{ position: 'absolute', bottom: '65px', left: '10px', display: 'flex', gap: '8px', padding: '14px', background: 'var(--bg-secondary)', zIndex: 100, flexWrap: 'wrap', maxWidth: '320px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
                      {['👍', '❤️', '🔥', '😂', '😮', '🚀', '🎉', '👏', '👀', '💯', '✨', '🤝', '💡', '✅', '👑', '⭐', '📢', '💸', '📁', '📄', '📷', '🎨', '🎬', '📊'].map((em) => (
                        <button key={em} type="button" onClick={() => handleAppendEmoji(em)} style={{ fontSize: '1.3rem', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>{em}</button>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1, padding: '40px', textAlign: 'center' }}>
              <MessageSquare size={56} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.4 }} />
              <h4 style={{ fontWeight: 800, margin: '0 0 8px' }}>Select a Conversation</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '360px' }}>
                Choose an active campaign conversation from the left sidebar to start messaging.
              </p>
            </div>
          )}
        </div>

        {/* Lightbox Fullscreen Modal for Image Attachments */}
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 20000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
            }}
          >
            <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setLightboxImage(null)}
                style={{ position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕ Close
              </button>
              <img src={lightboxImage} alt="Fullscreen Attachment" style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 'var(--radius-md)', objectFit: 'contain', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        )}

        <style>{`
          .chat-inbox-grid {
            display: grid;
            grid-template-columns: 360px 1fr;
            gap: 24px;
            height: calc(100vh - 180px);
          }
          .inbox-left-pane {
            display: flex;
            flex-direction: column;
          }
          .inbox-right-pane {
            display: flex;
            flex-direction: column;
          }
          .mobile-back-btn {
            display: none;
          }
          @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-4px); }
          }
          @media (max-width: 768px) {
            .chat-inbox-grid {
              grid-template-columns: 1fr;
              height: calc(100vh - 120px);
            }
            .inbox-left-pane {
              display: ${mobileShowChat ? 'none' : 'flex'} !important;
            }
            .inbox-right-pane {
              display: ${mobileShowChat ? 'flex' : 'none'} !important;
            }
            .mobile-back-btn {
              display: inline-flex !important;
            }
          }
        `}</style>
      </div>
    );
  };

  // RENDER DYNAMIC ADMIN CONTENT TABS
  const renderAdminTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <div className="animate-fade-in-up">
            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL REGISTERED USERS</span>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>{adminStats.totalUsers}</div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return renderAnalyticsLayout();

      case 'settings':
        return renderSettingsLayout();

      default:
        return <div>Tab not found.</div>;
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome, {user?.name}!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {user.role === 'admin' ? 'Monitor platform operations, moderate users and campaign briefs, and resolve report tickets.' : (user.role === 'creator' ? 'Manage your portfolios, applications, and payouts.' : 'Post campaigns briefs, review applicants, and release contract payments.')}
          </p>
        </div>
      </div>

      {/* Render role layouts */}
      {user.role === 'admin' ? renderAdminTab() : (user.role === 'creator' ? renderCreatorTab() : renderBrandTab())}

      {/* Change Request Feedback Modal */}
      {changeRequestModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '500px', width: '100%', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Request Revision / Changes</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Deliverable: <strong>{changeRequestModal.title}</strong>
            </p>
            <div className="form-group mb-4">
              <label className="form-label">Revision Instructions & Feedback Notes</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Explain clearly what changes or adjustments the creator needs to make..."
                value={changeRequestModal.feedbackNotes}
                onChange={e => setChangeRequestModal({ ...changeRequestModal, feedbackNotes: e.target.value })}
                required
              />
            </div>
            <div className="d-flex gap-3">
              <button
                onClick={() => {
                  if (changeRequestModal.feedbackNotes) {
                    handleRequestChanges(changeRequestModal.wsId, changeRequestModal.mId, changeRequestModal.feedbackNotes);
                    setChangeRequestModal(null);
                  }
                }}
                disabled={!changeRequestModal.feedbackNotes?.trim()}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Send Request
              </button>
              <button
                onClick={() => setChangeRequestModal(null)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
