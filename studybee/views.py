from django.shortcuts import render

def main(request):
        return render(request, 'studybee/main.html', {})
