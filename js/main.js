/*jslint browser: true */
/*jslint unparam: true */
/*global jQuery, $, bootbox */

/**
 * ================================= MAIN STRUCTURE ===========================================
 */

$.Script({
  module: {
    register: function () {
      $('.module-exempt').click(function () {
        var $this = $(this);
        bootbox.confirm('<div>Reason:</div><div><textarea name="reason" class="form-control"></textarea></div>', function (result) {
          if (result) {
            $.ajax({
              type: "POST",
              url: '/module/exempt',
              dataType: "json",
              data: {
                reason: $('[name=reason]').val(),
                module_id: $this.data('id')
              },
              success: function (data) {
                window.location.href = '/dashboard/index';
              }
            });
          }
        });
      });
    },
    view: function (e) {
      $('.teacher-swich').change(function () {
        var $this = $(this);
        $.ajax({
          type: "POST",
          url: '/ad_module/ajaxModify',
          dataType: "json",
          data: {
            Ad_module: {
              type: $this.data('type'),
              module_id: $this.data('module_id'),
              data: $this.is(':checked') ? 1 : 0
            }
          },
          success: function (data) {}
        });
      });
      $(document).on('click', '.topic-item', function () {
        var $this = $(this);
        $.ajax({
          type: "POST",
          url: '/message/ajaxRead',
          dataType: "json",
          data: {
            topic_id: $this.data('id')
          },
          success: function (data) {
            if (data.status) {
              $('.topic-content').html(data.html);
            }
          }
        });
      });
      $(document).on('click', '.delete-message', function (e) {
        e.preventDefault();
        var $this = $(this);
        $.ajax({
          type: "POST",
          url: '/message/ajaxDelete',
          dataType: "json",
          data: {
            message_id: $this.data('message_id')
          },
          success: function (data) {
            if (data.status) {
              $this.closest('.itemdiv').remove();
            }
          }
        });
      });
      $(document).on('submit', '#new-forum-message', function (e) {
        var $this = $(this);
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: $this.attr('action'),
          dataType: "json",
          data: $this.serialize(),
          success: function (data) {
            if (data.status) {
              $('.topic-content').html(data.html);
            }
          }
        });
      });
    }
  },
  course: {
    view: function (e) {
      /**
       * Read message
       */
      $(document).on('click', '.topic-item', function () {
        var $this = $(this);
        $.ajax({
          type: "POST",
          url: '/message/ajaxRead',
          dataType: "json",
          data: {
            topic_id: $this.data('id')
          },
          success: function (data) {
            if (data.status) {
              $('.topic-content').html(data.html);
            }
          }
        });
      });
      $(document).on('click', '.read-message-link', function (e) {
        e.preventDefault();
        var $this = $(this);
        $.ajax({
          type: "POST",
          url: '/email/ajaxRead',
          dataType: "json",
          data: {
            id: $this.data('id')
          },
          success: function (data) {
            if (data.status) {
              bootbox.dialog({
                message: '<p><strong>From:</strong> ' + (data.email.from_email !== null ? data.email.from_email : data.email.uemail) +
                  '</p><p><strong>Subject:</strong> ' + data.email.subject +
                  '</p><div><strong>Message:</strong> ' + data.email.message + '</div>',
                title: "Read message",
                buttons: {
                  success: {
                    label: "Close",
                    className: "btn-register",
                    callback: function () {
                      $this.removeClass('read-message-link');
                      $this.closest('tr').find('img').attr('src', '/images/email-read-icon.jpg');
                      $('#messages-closed-table tbody').append($this.closest('tr').detach());
                    }
                  },
                }
              });
            }
          }
        });
      });
    }
  },
  /**
   * Home Controller
   */
  home: {
    /**
     * Index Action
     * @param e
     */
    index: function (e) {

      function resizeSlider(jcarousel) {

      }

      $(function () {
        var jcarousel = $('.jcarousel');

        jcarousel
          .on('jcarousel:reload jcarousel:create', function () {
            jcarousel.jcarousel('items').width(jcarousel.innerWidth());
          })
          .on('jcarousel:reloadend jcarousel:createend', function (e) {
          })
          .on('jcarousel:scroll', function (event, carousel, target, animate) {
            resizeSlider(jcarousel);
          })
          .jcarousel({
            wrap: 'circular',
            animation: {
              duration: 800,
              easing:   'linear',
              complete: function () {
              }
            }
          }).jcarouselAutoscroll({
            interval: 5000,
            target: '+=1',
            autostart: true
          });

        $('.jcarousel-control-prev')
          .on('jcarouselcontrol:active', function () {
            $(this).removeClass('inactive');
          })
          .on('jcarouselcontrol:inactive', function () {
            $(this).addClass('inactive');
          })
          .jcarouselControl({
            target: '-=1'
          });

        $('.jcarousel-control-next')
          .on('jcarouselcontrol:active', function () {
            $(this).removeClass('inactive');
          })
          .on('jcarouselcontrol:inactive', function () {
            $(this).addClass('inactive');
          })
          .on('click', function (e) {
            e.preventDefault();
          })
          .jcarouselControl({
            target: '+=1'
          });

        $('.jcarousel-pagination')
          .on('jcarouselpagination:active', 'a', function () {
            $(this).addClass('active');
          })
          .on('jcarouselpagination:inactive', 'a', function () {
            $(this).removeClass('active');
          })
          .on('click', function (e) {
            e.preventDefault();
          })
          .jcarouselPagination({
            item: function (page) {
              return '<a href="#' + page + '">' + page + '</a>';
            }
          });

        $('.jcarousel-pagination').append(function () {
          return '<div class="jcarousel-controlls"><a href="#" class="jcarousel-play-pause"><i class="fa fa-pause"></i></a></div>';
        });
        $('.jcarousel-play-pause').click(function (e) {
          e.preventDefault();
          var $this = $(this);
          $this.toggleClass('pause');
          if ($this.hasClass('pause')) {
            jcarousel.jcarouselAutoscroll('stop');
            $this.find('i').attr('class', 'fa fa-play');
          } else {
            jcarousel.jcarouselAutoscroll('start');
            $this.find('i').attr('class', 'fa fa-pause');
          }
        });
      });

    }
  },
  /**
   * AUTH CONTROLLER
   */
  auth: {
    /**
     * ACTION INDEX
     */
    index: function (e) {
      $('.sing-in').on('click', function (e) {
        $('#User_role').val($(this).data('role'));
        $('#auth-register-form')[0].reset();
      });
    }
  },
  /**
   * Profile Controller
   */
  profile: {
    /**
     * Action edit
     */
    edit: function (e) {
      $('.change-password-button').click(function (e) {
        e.preventDefault();
        $('#User_password').removeAttr('disabled');
        $('#passconf').removeAttr('disabled');
      });
    }
  },
  /**
   * Attendance Controller
   */
  attendance: {
    /**
     * Index Action
     */
    index: function (e) {
      $('#attendance-form').submit(function (e) {
        var $this = $(this);
        $this.find('[type=submit]').addClass('loading');
        e.preventDefault();
        $.ajax({
          type: "POST",
          dataType: "json",
          data: $this.serialize(),
          success: function (data) {
            $this.find('[type=submit]').removeClass('loading');
            if (data.status) {
              $('.attendance-list').html(data.html);
            }
          }
        });
      });
      $(document).on('click', '.attendance-delete', function (e) {
        e.preventDefault();
        var $this = $(this);
        $.ajax({
          type: "POST",
          dataType: "json",
          url: "/attendance/delete",
          data: {
            id: $this.data('id')
          },
          success: function (data) {
            if (data.status) {
              $this.closest('tr').remove();
            }
          }
        });
      });
    }
  }
});
