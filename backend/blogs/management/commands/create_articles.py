# blogs/management/commands/create_articles.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from blogs.models import Article


class Command(BaseCommand):
    help = "Creates up to 20 test articles for pagination."

    def handle(self, *args, **options):
        User = get_user_model()
        user = User.objects.first()

        if not user:
            self.stdout.write(
                self.style.ERROR("❌ No user found! Please create a user first.")
            )
            return

        target_count = 20
        existing_count = Article.objects.filter(
            title__startswith="Test Article"
        ).count()
        needed = target_count - existing_count

        if needed > 0:
            self.stdout.write(
                f"Found {existing_count} test articles. Creating {needed} more..."
            )
            for i in range(existing_count, target_count):
                Article.objects.create(
                    title=f"Test Article {i + 1}",
                    content="This is a test article for pagination.",
                    status="published",
                    creator=user,
                )
            self.stdout.write(
                self.style.SUCCESS(f"✅ Successfully created {needed} new articles.")
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"ℹ️ You already have {existing_count} or more test articles. No action needed."
                )
            )
