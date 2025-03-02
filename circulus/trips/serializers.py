from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile, City, Trip, TripItinerary, JoinRequest, ChatMessage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'user', 'name', 'current_location', 'age', 'gender', 'profession', 'photos']

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'image']

class TripItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = TripItinerary
        fields = ['day', 'description']

class TripSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    destination = CitySerializer(read_only=True)
    destination_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(),
        source='destination',
        write_only=True
    )
    members = UserSerializer(many=True, read_only=True)
    itinerary_items = TripItinerarySerializer(many=True, read_only=True)
    current_members_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'host', 'group_name', 'destination', 'destination_id',
            'start_date', 'end_date', 'description', 'min_age', 'max_age',
            'required_members', 'members', 'itinerary_items', 'current_members_count',
            'created_at'
        ]

class TripCreateSerializer(serializers.ModelSerializer):
    itinerary = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )
    
    class Meta:
        model = Trip
        fields = [
            'id', 'group_name', 'destination', 'start_date', 'end_date',
            'description', 'min_age', 'max_age', 'required_members', 'itinerary'
        ]
    
    def create(self, validated_data):
        itinerary_data = validated_data.pop('itinerary')
        validated_data['host'] = self.context['request'].user
        trip = Trip.objects.create(**validated_data)
        
        for item in itinerary_data:
            TripItinerary.objects.create(
                trip=trip,
                day=item['day'],
                description=item['description']
            )
        
        return trip

class JoinRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    trip = TripSerializer(read_only=True)
    
    class Meta:
        model = JoinRequest
        fields = ['id', 'trip', 'user', 'status', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'message', 'timestamp']

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
    
    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1']
        )
        
        # Create empty profile
        Profile.objects.create(
            user=user,
            name="",
            current_location="",
            age=0,
            gender=""
        )
        
        return user
