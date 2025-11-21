import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from 'layouts/admin.layout';
import ClientLayout from 'layouts/client.layout';
import HomePage from '@/pages/client/home/home.page';
import DashboardPage from 'pages/admin/dashboard.page';
import UsersPage from 'pages/admin/users.page';
import PlanPage from 'pages/admin/plans.page';
import BadgePage from 'pages/admin/badges.page';
import ArticlePage from 'pages/admin/articles.page';
import VideoPage from 'pages/admin/videos.page';
import VocabularyPage from 'pages/admin/vocabularies.page';
import LoginPage from 'pages/auth/login.page';
import ProtectedRoute from '@/components/common/share/protected-route.component';
import PermissionsPage from 'pages/admin/permissions.page';
import ForbiddenPage from 'pages/error/403.page';
import NotFoundPage from 'pages/error/404.page';
import PermissionGuard from '@/components/common/share/permission-guard.component';
import AdminGuard from '@/components/common/share/admin-guard.component';
import LoggingPage from 'pages/admin/logging.page';
import LeaderboardPage from '@/pages/client/leaderboard/leaderboard.page';
import DictionaryPage from '@/pages/client/dictionary/dictionary.page';
import VocabularyDetailPage from '@/pages/client/vocabulary/vocabulary-detail.page';
import VocabularyListPage from '@/pages/client/vocabulary/vocabulary-list.page';
import NotebookPage from '@/pages/client/notebook/notebook.page';
import GrammarListPage from '@/pages/client/grammar/grammar-list.page';
import GrammarPage from 'pages/admin/grammars.page';
import GrammarDetailPage from '@/pages/client/grammar/grammar-detail.page';
import ArticleListPage from '@/pages/client/article/article-list.page';
import ArticleDetailPage from '@/pages/client/article/article-detail.page';
import VideoListPage from '@/pages/client/video/video-list.page';
import VideoDetailPage from '@/pages/client/video/video-detail.page';
import CommunityPage from 'pages/client/community/community.page';
import PostDetailPage from 'pages/client/community/post-detail.page';
import ProfilePage from 'pages/client/profile/profile.page';
import StorePage from 'pages/client/store/store.page';
import PremiumPage from 'pages/client/premium/premium.page';
import SubscriptionPage from 'pages/admin/subscription.page';
import RevenueStatisticPage from 'pages/admin/statistic.page';
import ReviewPage from 'pages/client/review/review.page';
import ProcessingPage from 'pages/client/review/processing.page';
import ResultPage from 'pages/client/review/result.page';
import RegisterPage from 'pages/auth/register.page';
import ForgotPasswordPage from 'pages/auth/forgot-password.page';
import FlashcardPage from 'pages/client/review/flashcard.page';
import DictationPage from 'pages/admin/dictation.page';
import DictationListPage from 'pages/client/dictation/dictation-list.page';
import DictationDetailPage from 'pages/client/dictation/dictation-detail.page';

const routes = [
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <ClientLayout />,
                children: [
                    {
                        index: true,
                        element: (
                            <PermissionGuard apiPath="/api/v1/leaderboard" method="GET">
                                <PermissionGuard apiPath="/api/v1/users/me/dashboard" method="GET">
                                    <HomePage />
                                </PermissionGuard>
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'leaderboard',
                        element: (
                            <PermissionGuard apiPath="/api/v1/leaderboard" method="GET">
                                <PermissionGuard apiPath="/api/v1/users/me/dashboard" method="GET">
                                    <LeaderboardPage />
                                </PermissionGuard>
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'dictionary',
                        element: (
                            <PermissionGuard apiPath="/api/v1/categories" method="GET">
                                <PermissionGuard apiPath="/api/v1/vocabularies" method="GET">
                                    <DictionaryPage />
                                </PermissionGuard>
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'vocabularies',
                        element: (
                            <PermissionGuard apiPath="/api/v1/categories" method="GET">
                                <PermissionGuard apiPath="/api/v1/vocabularies" method="GET">
                                    <VocabularyListPage />
                                </PermissionGuard>
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'vocabularies/category/:categoryId',
                        element: (
                            <PermissionGuard apiPath="/api/v1/categories" method="GET">
                                <VocabularyListPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'vocabularies/:id',
                        element: (
                            <PermissionGuard apiPath="/api/v1/vocabularies/{id}" method="GET">
                                <VocabularyDetailPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'notebook',
                        element: (
                            <PermissionGuard apiPath="/api/v1/notebook/level/{level}" method="GET">
                                <NotebookPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'grammars',
                        element: (
                            <PermissionGuard apiPath="/api/v1/categories" method="GET">
                                <PermissionGuard apiPath="/api/v1/grammars" method="GET">
                                    <GrammarListPage />
                                </PermissionGuard>
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'grammars/category/:categoryId',
                        element: (
                            <PermissionGuard apiPath="/api/v1/categories" method="GET">
                                <GrammarListPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'grammars/:id',
                        element: (
                            <PermissionGuard apiPath="/api/v1/grammars/{id}" method="GET">
                                <GrammarDetailPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'articles',
                        element: (
                            <PermissionGuard apiPath="/api/v1/articles" method="GET">
                                <ArticleListPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'articles/category/:categoryId',
                        element: (
                            <PermissionGuard apiPath="/api/v1/categories" method="GET">
                                <ArticleListPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'articles/:id',
                        element: (
                            <PermissionGuard apiPath="/api/v1/articles/{id}" method="GET">
                                <ArticleDetailPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'videos',
                        element: (
                            <PermissionGuard apiPath="/api/v1/videos" method="GET">
                                <VideoListPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'videos/category/:categoryId',
                        element: (
                            <PermissionGuard apiPath="/api/v1/categories" method="GET">
                                <VideoListPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'videos/:id',
                        element: (
                            <PermissionGuard apiPath="/api/v1/videos/{id}" method="GET">
                                <VideoDetailPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'dictations',
                        element: (
                            <DictationListPage />
                        ),
                    },
                    {
                        path: 'dictations/category/:categoryId',
                        element: (
                            <DictationListPage />
                        ),
                    },
                    {
                        path: 'dictations/:id',
                        element: (
                            <DictationDetailPage />
                        ),
                    },
                    {
                        path: 'community',
                        element: (
                            <PermissionGuard apiPath="/api/v1/posts" method="GET">
                                <CommunityPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'posts/:id',
                        element: (
                            <PermissionGuard apiPath="/api/v1/posts/{id}" method="GET">
                                <PostDetailPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'profile',
                        element: (
                            <PermissionGuard apiPath="/api/v1/users/me/dashboard" method="GET">
                                <ProfilePage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'store',
                        element: (
                            <PermissionGuard apiPath="/api/v1/plans" method="GET">
                                <StorePage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'premium',
                        element: (
                            <PermissionGuard apiPath="/api/v1/plans" method="GET">
                                <PremiumPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'review/quiz',
                        element: (
                            <PermissionGuard apiPath="/api/v1/quizzes/{id}/start" method="POST">
                                <ReviewPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'review/processing',
                        element: (
                            <PermissionGuard apiPath="/api/v1/quizzes/{id}/start" method="POST">
                                <ProcessingPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'quiz/results/:attemptId',
                        element: (
                            <PermissionGuard apiPath="/api/v1/quizzes/attempts/{attemptId}" method="GET">
                                <ResultPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'review/flashcards',
                        element: (
                            <PermissionGuard apiPath="/api/v1/vocabularies" method="GET">
                                <FlashcardPage />
                            </PermissionGuard>
                        ),
                    },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/admin',
                element: (
                    <AdminGuard>
                        <AdminLayout />
                    </AdminGuard>
                ),
                children: [
                    {
                        index: true,
                        element: (
                            <DashboardPage />
                        ),
                    },
                    {
                        path: 'users',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/users" method="GET">
                                <UsersPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'plans',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/plans" method="GET">
                                <PlanPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'badges',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/badges" method="GET">
                                <BadgePage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'articles',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/articles" method="GET">
                                <ArticlePage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'videos',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/videos" method="GET">
                                <VideoPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'grammars',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/grammars" method="GET">
                                <GrammarPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'vocabularies',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/vocabularies" method="GET">
                                <VocabularyPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'permissions',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/permissions" method="GET">
                                <PermissionsPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'subscriptions',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/subscriptions" method="GET">
                                <SubscriptionPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'statistics',
                        element: (
                            <PermissionGuard apiPath="/api/v1/admin/statistics/revenue" method="GET">
                                <RevenueStatisticPage />
                            </PermissionGuard>
                        ),
                    },
                    {
                        path: 'logging',
                        element: <LoggingPage />
                    },
                    {
                        path: 'dictations',
                        element: <DictationPage />
                    }
                ],
            }
        ]
    },
    {
        path: '/403',
        element: <ForbiddenPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

export const router = createBrowserRouter(routes);