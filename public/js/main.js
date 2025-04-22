document.addEventListener('DOMContentLoaded', function() {
  console.log('Приложение телефонного справочника загружено');
  
  // Обработчик клика по строке таблицы
  const tableRows = document.querySelectorAll('tr.clickable');
  tableRows.forEach(row => {
    row.addEventListener('click', function() {
      const contactId = this.getAttribute('data-id');
      if (contactId) {
        window.location.href = `/update/${contactId}`;
      }
    });
  });
  
  // Если в будущем понадобится добавить интерактивную функциональность,
  // можно разместить её здесь
  
  // Например, валидация формы перед отправкой
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(event) {
      const nameInput = document.getElementById('name');
      const phoneInput = document.getElementById('phone');
      
      if (nameInput.value.trim() === '') {
        alert('Пожалуйста, введите имя');
        event.preventDefault();
        return;
      }
      
      if (phoneInput.value.trim() === '') {
        alert('Пожалуйста, введите номер телефона');
        event.preventDefault();
        return;
      }
      
      // Валидация формата телефона для Беларуси
      // Допустимые форматы:
      // +375 XX XXXXXXX
      // +375XXXXXXXXX
      // 375XXXXXXXXX
      // +375 (XX) XXX-XX-XX
      // и т.д.
      const phoneRegex = /^(\+?375)[\s-]?\(?(?:25|29|33|44|17)[\s\)-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
      if (!phoneRegex.test(phoneInput.value)) {
        if (!confirm('Формат телефона не соответствует формату номеров Беларуси. Всё равно сохранить?')) {
          event.preventDefault();
          return;
        }
      }
    });
  }
}); 